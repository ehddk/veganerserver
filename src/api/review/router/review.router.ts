import express from "express";

import { pool } from "@/config/database";
import { DbReviewRepository } from "../repository/dbReview.repository";
import { ReviewServicesImpl } from "../service/review.service";
import ReviewController from "../controller/review.controller";
import { authRoleMiddleware } from "@/api/common/middlewares/authRole.middleware";

export const reviewRouter = express.Router();

// const REVIEW_ROUTES = {
//   GET_REVIEW: "/api/review",
//   CREATE_REVIEW: "/api/review",
//   UPDATE_REVIEW: "/api/review/:id",
//   DELETE_REVIEW: "/api/review/:id",
// };

const reviewController = new ReviewController(
  new ReviewServicesImpl(new DbReviewRepository(pool))
);

reviewRouter.get("/:restaurant_id", reviewController.getReviews);
reviewRouter.post(
  "/:restaurant_id",
  authRoleMiddleware(["user"]),
  reviewController.createReview
);
reviewRouter.put(
  "/:restaurant_id/:id",
  authRoleMiddleware(["user"]),
  reviewController.updateReview
);
reviewRouter.delete(
  "/restaurant_id/:id",
  authRoleMiddleware(["user"]),
  reviewController.deleteReview
);
