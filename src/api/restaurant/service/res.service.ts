import HttpException from "@/api/common/exceptions/http.exception";
import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";
import { RestuarantRepository } from "../repository/res.repository";
import { RestaurantService } from "./res.service.type";
import { mapOpenApiToDbModel } from "../model/res.model";
import { crawlImages } from "@/utils/imageCrawler";

const API_PAGE_SIZE = 1000;

export class ResServicesImpl implements RestaurantService {
  private readonly _resRepository: RestuarantRepository;
  private readonly API_KEY = process.env.OPEN_API_KEY;

  constructor(resRepository: RestuarantRepository) {
    this._resRepository = resRepository;
  }

  async getApiData(startIndex: number, endIndex: number): Promise<any> {
    const fullUrl = `http://openapi.seoul.go.kr:8088/${this.API_KEY}/json/CrtfcUpsoInfo/${startIndex}/${endIndex}`;

    const res = await fetch(fullUrl);
    if (!res.ok) {
      throw new Error(`openapi fetch failed:${res.status}`);
    }
    return res.json();
  }

  async saveAllOpenData(): Promise<any> {
    let startIndex = 1;
    let totalCount = Infinity;
    const allRecords: any[] = [];

    while (startIndex <= totalCount) {
      const endIndex = startIndex + API_PAGE_SIZE - 1;

      try {
        const response = await this.getApiData(startIndex, endIndex);
        const info = response?.CrtfcUpsoInfo;
        const records = info?.row;
        if (!info || !records || records.length === 0) {
          // 더 이상 데이터가 없거나 응답 구조 오류
          console.log(`No records found at index ${startIndex}. Stopping.`);
          break;
        }
        if (totalCount === Infinity) {
          totalCount = info.list_total_count;
        }
        allRecords.push(...records);
        startIndex += API_PAGE_SIZE;
      } catch (error) {
        console.error(`Error fetching data at index ${startIndex}:`, error);
        // 에러 발생 시 반복문 중단
        break;
      }
    }

    const dbRecords = allRecords.map(mapOpenApiToDbModel);
    await this._resRepository.saveBatch(dbRecords as IRestaurant[]);
  }

  async getRestaurants(): Promise<IRestaurant[]> {
    try {
      const values = await this._resRepository.findAll();
      // 결과물을 담을 배열
      const updatedRestaurants: IRestaurant[] = [];

      // Promise.all 대신 순차적으로 하나씩 처리
      for (const res of values) {
        const hasNoImage =
          !res.image_url ||
          !Array.isArray(res.image_url) ||
          res.image_url.filter((url) => url !== null && url !== "").length ===
            0;
        if (hasNoImage) {
          try {
            // 하나씩 기다리며 실행 (await)

            const newImages = await crawlImages(res.upso_name);

            if (newImages && newImages.length > 0) {
              if (res.id) {
                await this._resRepository.saveImages(res.id, newImages);
              }
              res.image_url = newImages;
            }
          } catch (crawlError) {
            console.error(`Crawling failed for ${res.upso_name}:`, crawlError);
          }
        }
        updatedRestaurants.push(res);
      }

      return updatedRestaurants;
    } catch (error) {
      console.error("Error in getRestaurants:", error);
      throw new Error("목록 조회 중 오류 발생");
    }
  }
  async getRestaurantById(
    id: string,
    currentUserId?: string
  ): Promise<RestaurantResponseDTO | null> {
    try {
      const restaurant = await this._resRepository.findById(id, currentUserId);
      //console.log("service:::", restaurant);
      if (!restaurant) {
        throw new HttpException(404, "해당 음식점을 찾을 수 없습니다.");
      }
      return new RestaurantResponseDTO(restaurant);
    } catch (error) {
      throw new Error("음식점 조회 중 오류 발생");
    }
  }
  async createRestaurant(
    restaurant: Pick<
      IRestaurant,
      | "upso_name"
      | "category"
      | "rdn_code"
      | "source_type"
      | "cgg_code_name"
      | "tel_no"
    >
  ): Promise<RestaurantResponseDTO> {
    try {
      // 도로명주소를 좌표로 변환 (실패해도 등록은 진행, 지도는 주소 기반으로 폴백)
      const coords = await this.geocodeAddress(restaurant.rdn_code);

      const newRestauantData = {
        ...restaurant,
        latitude: coords?.lat ?? 0,
        longitude: coords?.lon ?? 0,
        // 목록(findAll)이 '채식음식점'을 기준으로 노출하므로 동일 값으로 저장.
        // 공식 데이터와의 구분은 source_type='USER'로 한다.
        ctfc_gbn_name: "채식음식점",
      };
      const newRestaurant = await this._resRepository.save(newRestauantData);
      return new RestaurantResponseDTO(newRestaurant);
    } catch (error) {
      console.error("createRestaurant error:", error);
      throw new Error("음식점 생성 중 오류 발생");
    }
  }

  /**
   * 도로명주소 → 위경도 변환. (OSM Nominatim, 키 불필요)
   * 프론트 지도(LeafletMap)와 동일한 OSM 스택을 사용한다.
   * 실패 시 null 을 반환하고 등록 자체는 막지 않는다.
   */
  private async geocodeAddress(
    address?: string
  ): Promise<{ lat: number; lon: number } | null> {
    if (!address || address.trim() === "") return null;

    const variants = this.buildAddressVariants(address);
    for (const query of variants) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1&countrycodes=kr`;
        const res = await fetch(url, {
          headers: {
            "Accept-Language": "ko",
            // Nominatim 이용약관상 식별 가능한 User-Agent 권장
            "User-Agent": "veganer-app/1.0 (restaurant-geocoding)",
          },
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
        }
      } catch (e) {
        console.error("geocode failed for", query, e);
      }
    }
    return null;
  }

  private buildAddressVariants(raw: string): string[] {
    const CITY_REGEX =
      /(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|강원특별자치도|충청북도|충청남도|전라북도|전북특별자치도|전라남도|경상북도|경상남도|제주특별자치도)/;
    const DISTRICT_REGEX = /(\S+?[구시군])/;
    const ROAD_REGEX = /(\S*?[로길])\s*(\d+(?:-\d+)?)/;

    const city = raw.match(CITY_REGEX)?.[1];
    const district = raw.match(DISTRICT_REGEX)?.[1];
    const roadMatch = raw.match(ROAD_REGEX);
    const road = roadMatch?.[1];
    const num = roadMatch?.[2];

    const variants: string[] = [];
    if (city && district && road && num)
      variants.push(`${city} ${district} ${road} ${num}`);
    if (district && road && num) variants.push(`${district} ${road} ${num}`);
    if (road && num) variants.push(`${road} ${num}`);
    variants.push(raw);

    return Array.from(new Set(variants));
  }
}
