import { PaginatedReviewResponseDTO, ReviewResponseDTO } from "../dto/ReviewResponse.dto";
import { ReviewRepository } from "../repository/review.repository";
import { ReviewService } from "./review.service.type";
export declare class ReviewServicesImpl implements ReviewService {
    private readonly _reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    getReviews(restaurant_id: string, limit: number, offset: number): Promise<PaginatedReviewResponseDTO>;
    createReview(review: Omit<IReview, "id" | "createdAt" | "updatedAt">): Promise<ReviewResponseDTO>;
    updateReview(id: string, currentUserId: string, reviewInfo: Omit<IReview, "id" | "user_id" | "restaurant_id" | "createdAt">): Promise<void>;
    deleteReview(id: string): Promise<void>;
}
