import express from "express";
import { DbRestaurantRepository } from "../repository/dbRes.repository";
import { RestaurantController } from "../controller/res.controller";
import { ResServicesImpl } from "../service/res.service";
import { pool } from "@/config/database";

export const reviewRouter = express.Router();

const REVIEW_ROUTES = {
  GET_REVIEW: "/api/review",
  CREATE_REVIEW: "/api/review",
  UPDATE_REVIEW: "/api/review/:id",
  DELETE_REVIEW: "/api/review/:id",
};

const reviewController = new ReviewController(
  new ReviewServicesImpl(new DbReviewRepository(pool))
);

reviewRouter.get("/", reviewController.getReviews);
reviewRouter.post("/", reviewController.createRestaurant);
