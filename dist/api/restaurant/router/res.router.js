"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resRouter = void 0;
const express_1 = __importDefault(require("express"));
const dbRes_repository_1 = require("../repository/dbRes.repository");
const res_controller_1 = require("../controller/res.controller");
const res_service_1 = require("../service/res.service");
const database_1 = require("../../../config/database");
exports.resRouter = express_1.default.Router();
const RESTAURANT_ROUTES = {
    GET_RES: "/api/restaurant",
    GET_RES_BY_ID: "/api/restaurant/:id",
    CREATE_RES: "/api/restaurant",
    UPDATE_RES: "/api/restaurant",
};
const restaurantController = new res_controller_1.RestaurantController(new res_service_1.ResServicesImpl(new dbRes_repository_1.DbRestaurantRepository(database_1.pool)));
exports.resRouter.get("/", restaurantController.getRestaurants);
exports.resRouter.get("/:id", restaurantController.getRestaurantById);
exports.resRouter.post("/", restaurantController.createRestaurant);
//# sourceMappingURL=res.router.js.map