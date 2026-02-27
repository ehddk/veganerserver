import "dotenv/config";
import { RestuarantRepository } from "./res.repository";
import { Pool } from "pg";
export declare class DbRestaurantRepository implements RestuarantRepository {
    private readonly pool;
    constructor(dbPool: Pool);
    saveImages(id: string, imageUrls: string[]): Promise<void>;
    save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant>;
    saveBatch(restaurant: IRestaurant[]): Promise<void>;
    findAll(): Promise<IRestaurant[]>;
    findById(id: string): Promise<IRestaurant>;
}
