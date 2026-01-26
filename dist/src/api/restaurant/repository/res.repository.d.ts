export interface RestuarantRepository {
    findAll(): Promise<IRestaurant[]>;
    findById(id: string): Promise<IRestaurant | null>;
    save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant>;
    saveBatch(restaurant: IRestaurant[]): Promise<void>;
}
