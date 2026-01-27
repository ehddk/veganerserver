import { RestuarantRepository } from "./res.repository";
import { Pool } from "pg";
export declare class DbRestaurantRepository implements RestuarantRepository {
    private readonly pool;
    constructor(dbPool: Pool);
    save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant>;
    saveBatch(restaurant: IRestaurant[]): Promise<void>;
    findAll(): Promise<IRestaurant[]>;
    findById(id: string): Promise<IRestaurant>;
}
