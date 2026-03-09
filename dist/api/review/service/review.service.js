"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServicesImpl = void 0;
const http_exception_1 = __importDefault(require("../../../api/common/exceptions/http.exception"));
const ReviewResponse_dto_1 = require("../dto/ReviewResponse.dto");
class ReviewServicesImpl {
    _reviewRepository;
    constructor(reviewRepository) {
        this._reviewRepository = reviewRepository;
    }
    async getReviews(restaurant_id, limit, offset) {
        try {
            const values = await this._reviewRepository.findAll(restaurant_id, limit, offset);
            return values;
        }
        catch (error) {
            throw new Error("목록 조회 중 오류 발생");
        }
    }
    async createReview(review) {
        try {
            const newReview = await this._reviewRepository.save(review);
            return new ReviewResponse_dto_1.ReviewResponseDTO(newReview);
        }
        catch (error) {
            console.log("리뷰 생성 중 오류:", error);
            throw new Error("리뷰 생성 중 오류 발생");
        }
    }
    async updateReview(id, currentUserId, reviewInfo) {
        try {
            const updateReview = await this._reviewRepository.update(id, currentUserId, reviewInfo);
            //console.log("수정 리뷰", updateReview);
            if (!updateReview) {
                throw new http_exception_1.default(404, "해당 리뷰를 찾을 수 없습니다.");
            }
        }
        catch (error) {
            throw new Error("리뷰 수정 중 오류 발생");
        }
    }
    async deleteReview(id) {
        try {
            await this._reviewRepository.delete(id);
        }
        catch (error) {
            throw new Error("리뷰 삭제 중 오류 발생");
        }
    }
}
exports.ReviewServicesImpl = ReviewServicesImpl;
//# sourceMappingURL=review.service.js.map