import HttpException from "@/api/common/exceptions/http.exception";
import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";
import { RestuarantRepository } from "../repository/res.repository";
import { RestaurantService } from "./res.service.type";

export class ResServicesImpl implements RestaurantService {
  private readonly _resRepository: RestuarantRepository;

  constructor(resRepository: RestuarantRepository) {
    this._resRepository = resRepository;
  }
  async getRestaurants(): Promise<RestaurantResponseDTO> {
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
      "upsoName" | "category" | "rdnCode" | "rdnDetailAddr" | "source_type"
    >
  ): Promise<RestaurantResponseDTO> {
    try {
      const newRestaurant = await this._resRepository.save(restaurant);
      return new RestaurantResponseDTO(newRestaurant);
    } catch (error) {
      throw new Error("음식점 생성 중 오류 발생");
    }
  }
}
