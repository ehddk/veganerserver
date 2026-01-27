import { ReviewService } from "../service/review.service.type";
import { NextFunction, Request, Response } from "express";
export default class ReviewController {
    private readonly _reviewService;
    constructor(reviewService: ReviewService);
    getReviews(req: Request<getReviewRequest["params"], getReviewRequest["body"], getReviewResponse, getReviewRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    createReview(req: Request<createReviewRequest["path"], createReviewResponse, createReviewRequest["body"], createReviewRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    updateReview(req: Request<updateReviewRequest["path"], updateReviewResponse, updateReviewRequest["body"], updateReviewRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    deleteReview(req: Request<deleteReviewRequest["path"], deleteReviewResponse, deleteReviewRequest["body"], deleteReviewRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
}
