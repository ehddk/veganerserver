"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("../../../api/common/exceptions/http.exception"));
class ReviewController {
    _reviewService;
    constructor(reviewService) {
        this._reviewService = reviewService;
        this.createReview = this.createReview.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.updateReview = this.updateReview.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
    }
    async getReviews(req, res, next) {
        try {
            const restaurant_id = req.params.restaurant_id;
            const rawLimit = req.query.limit;
            const rawOffset = req.query.offset;
            const parsedLimit = parseInt(Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "", 10);
            const parsedOffset = parseInt(Array.isArray(rawOffset) ? rawOffset[0] : rawOffset || "", 10);
            const limit = isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
            const offset = isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;
            const values = await this._reviewService.getReviews(restaurant_id, limit, offset);
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "목록 조회 중 오류 발생");
        }
    }
    async createReview(req, res, next) {
        try {
            const { restaurant_id } = req.params;
            const { content, rating, image } = req.body;
            const user_id = req.user.userId;
            const numericRating = parseInt(rating, 10);
            const reviewData = {
                restaurant_id: restaurant_id,
                user_id: user_id,
                content: content,
                rating: numericRating,
                user: req.user.name,
                image: image,
            };
            const values = await this._reviewService.createReview(reviewData);
            res.status(201).json(values);
        }
        catch (error) {
            console.error("Error creating review (passing to error handler):", error);
            next(error);
            throw new http_exception_1.default(404, "리뷰 생성 중 오류 발생");
        }
    }
    async updateReview(req, res, next) {
        const { id } = req.params;
        const currentUserId = req.user.userId;
        console.log("current", currentUserId);
        try {
            await this._reviewService.updateReview(id, currentUserId, req.body);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "게시글 수정 중 오류 발생");
        }
    }
    async deleteReview(req, res, next) {
        const { id } = req.params;
        try {
            await this._reviewService.deleteReview(id);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "후기 삭제 중 오류 발생");
        }
    }
}
exports.default = ReviewController;
//# sourceMappingURL=review.controller.js.map