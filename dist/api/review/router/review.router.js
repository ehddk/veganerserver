"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../../../config/database");
const dbReview_repository_1 = require("../repository/dbReview.repository");
const review_service_1 = require("../service/review.service");
const review_controller_1 = __importDefault(require("../controller/review.controller"));
const authRole_middleware_1 = require("../../../api/common/middlewares/authRole.middleware");
exports.reviewRouter = express_1.default.Router();
// const REVIEW_ROUTES = {
//   GET_REVIEW: "/api/review",
//   CREATE_REVIEW: "/api/review",
//   UPDATE_REVIEW: "/api/review/:id",
//   DELETE_REVIEW: "/api/review/:id",
// };
const reviewController = new review_controller_1.default(new review_service_1.ReviewServicesImpl(new dbReview_repository_1.DbReviewRepository(database_1.pool)));
exports.reviewRouter.get("/:restaurant_id", reviewController.getReviews);
exports.reviewRouter.post("/:restaurant_id", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), reviewController.createReview);
exports.reviewRouter.put("/:restaurant_id/:id", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), reviewController.updateReview);
exports.reviewRouter.delete("/:restaurant_id/:id", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), reviewController.deleteReview);
//# sourceMappingURL=review.router.js.map