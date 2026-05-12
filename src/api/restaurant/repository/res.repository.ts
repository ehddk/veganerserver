export interface RestuarantRepository {
  findAll(): Promise<IRestaurant[]>;
  findById(
    id: string,
    currentUserId?: string
  ): Promise<IRestaurant | null>;
  save(restaurant: Omit<IRestaurant, "id">): Promise<IRestaurant>;
  saveBatch(restaurant: IRestaurant[]): Promise<void>;
  saveImages(id: string, imageUrl: string[]): Promise<void>;
  // findWithoutImages(limit: number): Promise<IRestaurant[]>;
}
