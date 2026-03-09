import { PaginatedReviewResponseDTO, ReviewResponseDTO } from "../dto/ReviewResponse.dto";
export interface ReviewService {
    getReviews(restaurant_id: string, limit: number, offset: number): Promise<PaginatedReviewResponseDTO>;
    createReview(review: Omit<IReview, "id" | "createdAt" | "updatedAt" | "user_name">): Promise<ReviewResponseDTO>;
    updateReview(id: string, currentUserId: string, reviewInfo: Omit<IReview, "id" | "user_id" | "restaurant_id" | "createdAt" | "user" | "user_name">): Promise<void>;
    deleteReview(id: string): Promise<void>;
}
