import { RestaurantService } from "../service/res.service.type";
import { NextFunction, Request, Response } from "express";
export declare class RestaurantController {
    private readonly _resService;
    constructor(resService: RestaurantService);
    getRestaurants(req: Request<getRestaurantsRequest["params"], getRestaurantsRequest["body"], getRestaurantsResponse, getRestaurantsRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    getRestaurantById(req: Request<getRestaurantRequest["path"], getRestaurantRequest["body"], getRestaurantResponse, getRestaurantRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    createRestaurant(req: Request<createRestaurantRequest["path"], createRestaurantRequest["body"], createRestaurantResponse, createRestaurantRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
}
