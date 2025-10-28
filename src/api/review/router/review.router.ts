import express from "express";

import { pool } from "@/config/database";
import { DbReviewRepository } from "../repository/dbReview.repository";
import { ReviewServicesImpl } from "../service/review.service";
import ReviewController from "../controller/review.controller";

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
reviewRouter.post("/:restaurant_id", reviewController.createReview);
reviewRouter.put("/:restaurant_id/:id", reviewController.updateReview);
reviewRouter.delete("/restaurant_id/:id", reviewController.deleteReview);
