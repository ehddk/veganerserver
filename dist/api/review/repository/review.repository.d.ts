import { PaginatedReviews } from "../@types/review.type";
export interface ReviewRepository {
    findAll(restaurant_id: string, limit: number, offset: number): Promise<PaginatedReviews>;
    save(review: Omit<IReview, "id" | "createdAt" | "updatedAt">): Promise<IReview>;
    update(id: string, currentUserId: string, reviewInfo: Partial<IReview>): Promise<IReview | null>;
    delete(id: string): Promise<void>;
}
