import HttpException from "@/api/common/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import { ScrapService } from "../service/scrap.service.type";

export default class ScrapController {
  private readonly _scrapService: ScrapService;

  constructor(scrapService: ScrapService) {
    this._scrapService = scrapService;

    this.toggle = this.toggle.bind(this);
    this.getList = this.getList.bind(this);
  }

  async toggle(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurantId = parseInt(req.params.restaurant_id, 10);
      if (isNaN(restaurantId)) {
        throw new HttpException(400, "유효하지 않은 식당 ID입니다.");
      }

      const userId = req.user.userId;
      const result = await this._scrapService.toggle(userId, restaurantId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;

      const limit = parseInt(req.query.limit as string, 10);
      const offset = parseInt(req.query.offset as string, 10);
      const safeLimit = isNaN(limit) || limit <= 0 ? 15 : limit;
      const safeOffset = isNaN(offset) || offset < 0 ? 0 : offset;
      const result = await this._scrapService.getList(
        userId,
        safeLimit,
        safeOffset
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
