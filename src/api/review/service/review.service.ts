import HttpException from "@/api/common/exceptions/http.exception";
import {
  PaginatedReviewResponseDTO,
  ReviewResponseDTO,
} from "../dto/ReviewResponse.dto";
import { ReviewRepository } from "../repository/review.repository";
import { ReviewService } from "./review.service.type";

export class ReviewServicesImpl implements ReviewService {
  private readonly _reviewRepository: ReviewRepository;

  constructor(reviewRepository: ReviewRepository) {
    this._reviewRepository = reviewRepository;
  }

  async getReviews(
    restaurant_id: string,
    limit: number,
    offset: number
  ): Promise<PaginatedReviewResponseDTO> {
    try {
      const values = await this._reviewRepository.findAll(
        restaurant_id,
        limit,
        offset
      );
      return values;
    } catch (error) {
      throw new Error("목록 조회 중 오류 발생");
    }
  }

  async createReview(
    review: Omit<IReview, "id" | "createdAt" | "updatedAt">
  ): Promise<ReviewResponseDTO> {
    try {
      const newReview = await this._reviewRepository.save(review);
      return new ReviewResponseDTO(newReview);
    } catch (error) {
      console.log("리뷰 생성 중 오류:", error);
      throw new Error("리뷰 생성 중 오류 발생");
    }
  }

  async updateReview(
    id: string,
    currentUserId: string,
    reviewInfo: Omit<IReview, "id" | "user_id" | "restaurant_id" | "createdAt">
  ): Promise<void> {
    try {
      const updateReview = await this._reviewRepository.update(
        id,
        currentUserId,
        reviewInfo
      );
      //console.log("수정 리뷰", updateReview);

      if (!updateReview) {
        throw new HttpException(404, "해당 리뷰를 찾을 수 없습니다.");
      }
    } catch (error) {
      throw new Error("리뷰 수정 중 오류 발생");
    }
  }
  async deleteReview(id: string): Promise<void> {
    try {
      await this._reviewRepository.delete(id);
    } catch (error) {
      throw new Error("리뷰 삭제 중 오류 발생");
    }
  }
}
