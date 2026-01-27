"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResponseDTO = void 0;
class ReviewResponseDTO {
    id;
    restaurant_id;
    user;
    user_id;
    content;
    createdAt;
    updatedAt;
    constructor(params) {
        this.id = params.id;
        this.restaurant_id = params.restaurant_id;
        this.user = params.user;
        this.user_id = params.user_id;
        this.content = params.content;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}
exports.ReviewResponseDTO = ReviewResponseDTO;
//# sourceMappingURL=ReviewResponse.dto.js.map