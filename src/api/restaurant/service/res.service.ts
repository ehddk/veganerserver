import HttpException from "@/api/common/exceptions/http.exception";
import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";
import { RestuarantRepository } from "../repository/res.repository";
import { RestaurantService } from "./res.service.type";
import { mapOpenApiToDbModel } from "../model/res.model";

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
          console.log(`Total records to fetch: ${totalCount}`);
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
    await this._resRepository.saveBatch(dbRecords);
  }
  async getRestaurants(): Promise<IRestaurant[]> {
    try {
      const values = await this._resRepository.findAll();

      return values;
    } catch (error) {
      throw new Error("목록 조회 중 오류 발생");
    }
  }
  async getRestaurantById(id: string): Promise<RestaurantResponseDTO | null> {
    try {
      const restaurant = await this._resRepository.findById(id);
      console.log("service:::", restaurant);
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
