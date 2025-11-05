import HttpException from "@/api/common/exceptions/http.exception";
import { ReviewService } from "../service/review.service.type";
import { NextFunction, Request, Response } from "express";

export default class ReviewController {
  private readonly _reviewService: ReviewService;
  constructor(reviewService: ReviewService) {
    this._reviewService = reviewService;

    this.createReview = this.createReview.bind(this);
    this.getReviews = this.getReviews.bind(this);
    this.updateReview = this.updateReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
  }
  async getReviews(
    req: Request<
      getReviewRequest["params"],
      getReviewRequest["body"],
      getReviewResponse,
      getReviewRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurant_id = req.params.restaurant_id;
      const rawLimit = req.query.limit;
      const rawOffset = req.query.offset;
      const parsedLimit = parseInt(
        Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "",
        10
      );
      const parsedOffset = parseInt(
        Array.isArray(rawOffset) ? rawOffset[0] : rawOffset || "",
        10
      );
      const limit: number =
        isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
      const offset: number =
        isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;
      const values = await this._reviewService.getReviews(
        restaurant_id,
        limit,
        offset
      );
      res.status(200).json(values);
    } catch (error) {
      throw new HttpException(404, "목록 조회 중 오류 발생");
    }
  }

  async createReview(
    req: Request<
      createReviewRequest["path"],
      createReviewResponse,
      createReviewRequest["body"],
      createReviewRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { restaurant_id } = req.params;

      const { content, rating } = req.body;
      const user_id = req.user.userId;
      const numericRating = parseInt(rating as unknown as string, 10);
      const reviewData: Omit<IReview, "id" | "createdAt" | "updatedAt"> = {
        restaurant_id: restaurant_id,
        user_id: user_id,
        content: content,
        rating: numericRating,
      };

      const values = await this._reviewService.createReview(reviewData);

      res.status(201).json(values);
    } catch (error) {
      console.error("Error creating review (passing to error handler):", error);
      next(error);
      throw new HttpException(404, "리뷰 생성 중 오류 발생");
    }
  }

  async updateReview(
    req: Request<
      updateReviewRequest["path"],
      updateReviewResponse,
      updateReviewRequest["body"],
      updateReviewRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      await this._reviewService.updateReview(id, req.body);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "게시글 수정 중 오류 발생");
    }
  }
  async deleteReview(
    req: Request<
      deleteReviewRequest["path"],
      deleteReviewResponse,
      deleteReviewRequest["body"],
      deleteReviewRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      await this._reviewService.deleteReview(id);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "후기 삭제 중 오류 발생");
    }
  }
}
