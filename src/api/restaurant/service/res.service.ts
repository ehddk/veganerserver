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
  async getRestaurantById(id: string): Promise<RestaurantResponseDTO | null> {
    try {
      const restaurant = await this._resRepository.findById(id);
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
      "upso_name" | "category" | "rdn_code" | "source_type"
    >
  ): Promise<RestaurantResponseDTO> {
    try {
      const newRestauantData = {
        ...restaurant,
        // source_id: null,
        latitude: 0,
        longitude: 0,
        ctfc_gbn_name: "USER",
      };
      const newRestaurant = await this._resRepository.save(newRestauantData);
      return new RestaurantResponseDTO(newRestaurant);
    } catch (error) {
      throw new Error("음식점 생성 중 오류 발생");
    }
  }
}
