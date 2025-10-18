import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";

export interface RestaurantService {
  getRestaurants(): Promise<RestaurantResponseDTO>;
  getRestaurantById(id: string): Promise<RestaurantResponseDTO | null>;
  createRestaurant(
    restaurant: Pick<
      IRestaurant,
      "upsoName" | "category" | "rdnCode" | "rdnDetailAddr" | "source_type"
    >
  ): Promise<RestaurantResponseDTO>;
}
