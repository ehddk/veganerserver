import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";

export interface RestaurantService {
  getApiData(startIndex: number, endIndex: number): Promise<any>;
  getRestaurants(): Promise<IRestaurant[]>;
  getRestaurantById(
    id: string,
    currentUserId?: string
  ): Promise<RestaurantResponseDTO | null>;
  createRestaurant(
    restaurant: Pick<
      IRestaurant,
      | "upso_name"
      | "category"
      | "rdn_code"
      | "source_type"
      | "cgg_code_name"
      | "tel_no"
    >
  ): Promise<RestaurantResponseDTO>;
}
