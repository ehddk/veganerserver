import { RestaurantResponseDTO } from "../dto/RestaurantResponse.dto";
import { RestuarantRepository } from "../repository/res.repository";
import { RestaurantService } from "./res.service.type";
export declare class ResServicesImpl implements RestaurantService {
    private readonly _resRepository;
    private readonly API_KEY;
    constructor(resRepository: RestuarantRepository);
    getApiData(startIndex: number, endIndex: number): Promise<any>;
    saveAllOpenData(): Promise<any>;
    getRestaurants(): Promise<IRestaurant[]>;
    getRestaurantById(id: string): Promise<RestaurantResponseDTO | null>;
    createRestaurant(restaurant: Pick<IRestaurant, "upso_name" | "category" | "rdn_code" | "source_type">): Promise<RestaurantResponseDTO>;
}
