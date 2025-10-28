import {
  PaginatedReviewResponseDTO,
  ReviewResponseDTO,
} from "../dto/ReviewResponse.dto";

export interface ReviewService {
  getReviews(
    restaurant_id: string,
    limit: number,
    offset: number
  ): Promise<PaginatedReviewResponseDTO>;

  createReview(
    review: Omit<IReview, "id" | "createdAt" | "updatedAt">
  ): Promise<ReviewResponseDTO>;

  updateReview(
    id: string,
    reviewInfo: Omit<IReview, "id" | "user_id" | "restaurant_id" | "createdAt">
  ): Promise<void>;
  deleteReview(id: string): Promise<void>;
}
