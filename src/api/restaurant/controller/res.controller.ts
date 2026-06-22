import { RestaurantService } from "../service/res.service.type";
import HttpException from "@/api/common/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

export class RestaurantController {
  private readonly _resService: RestaurantService;
  constructor(resService: RestaurantService) {
    this._resService = resService;

    this.getRestaurants = this.getRestaurants.bind(this);
    this.getRestaurantById = this.getRestaurantById.bind(this);
    this.createRestaurant = this.createRestaurant.bind(this);
  }

  async getRestaurants(
    req: Request<
      getRestaurantsRequest["params"],
      getRestaurantsRequest["body"],
      getRestaurantsResponse,
      getRestaurantsRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const values = await this._resService.getRestaurants();

      res.status(200).json(values);
    } catch (error) {
      throw new HttpException(404, "목록 조회 중 오류");
    }
  }
  async getRestaurantById(
    req: Request<
      getRestaurantRequest["path"],
      getRestaurantRequest["body"],
      getRestaurantResponse,
      getRestaurantRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const currentUserId = req.user?.userId;

    try {
      const values = await this._resService.getRestaurantById(
        id,
        currentUserId
      );
      res.status(200).json(values);
    } catch (error) {
      throw new HttpException(404, "음식점 조회 중 오류 발생");
    }
  }

  async createRestaurant(
    req: Request<
      createRestaurantRequest["path"],
      createRestaurantRequest["body"],
      createRestaurantResponse,
      createRestaurantRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        upso_name,
        /**도로명주소 */
        rdn_code,
        /**업종/카테고리 */
        category,
        /**자치구명 */
        cgg_code_name,
        /**전화번호 */
        tel_no,
      } = req.body;

      if (!upso_name || !rdn_code) {
        throw new HttpException(400, "업소명과 주소는 필수입니다.");
      }

      const values = await this._resService.createRestaurant({
        upso_name,
        rdn_code,
        category,
        cgg_code_name,
        tel_no,

        /* open API인지 사용자인지 */
        source_type: "USER",
      });
      res.status(201).json(values);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "음식점 생성 중 오류 발생");
    }
  }
}
