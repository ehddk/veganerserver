import { Pool } from "pg";
import { ReviewRepository } from "./review.repository";
import { PaginatedReviews } from "../@types/review.type";
export declare class DbReviewRepository implements ReviewRepository {
    private readonly pool;
    constructor(dbPool: Pool);
    save(review: Omit<IReview, "id" | "createdAt" | "updatedAt">): Promise<IReview>;
    findAll(restaurant_id: string, limit: number, offset: number): Promise<PaginatedReviews>;
    update(id: string, currentUserId: string, review: Partial<Omit<IReview, "id" | "createdAt" | "user_id">>): Promise<IReview | null>;
    delete(id: string): Promise<void>;
}
