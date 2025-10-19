import express from "express";
import { DbRestaurantRepository } from "../repository/dbRes.repository";
import { RestaurantController } from "../controller/res.controller";
import { ResServicesImpl } from "../service/res.service";
import { pool } from "@/config/database";

export const resRouter = express.Router();

const RESTAURANT_ROUTES = {
  GET_RES: "/api/restaurant",
  GET_RES_BY_ID: "/api/restaurant/:id",
  CREATE_RES: "/api/restaurant",
  UPDATE_RES: "/api/restaurant",
};

const restaurantController = new RestaurantController(
  new ResServicesImpl(new DbRestaurantRepository(pool))
);

resRouter.get("/", restaurantController.getRestaurants);
resRouter.get("/:id", restaurantController.getRestaurantById);
resRouter.post("/", restaurantController.createRestaurant);
