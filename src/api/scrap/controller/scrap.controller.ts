import HttpException from "@/api/common/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import { ScrapService } from "../service/scrap.service.type";
import { parseQueryInt } from "@/utils/query.util";

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

      const rawLimit = req.query.limit;
      const rawOffset = req.query.offset;
      const parsedLimit = parseQueryInt(req.query.limit, 15);
      const parsedOffset = parseQueryInt(req.query.offset, 0, true);
      const limit = isNaN(parsedLimit) || parsedLimit <= 0 ? 20 : parsedLimit;
      const offset = isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;

      const result = await this._scrapService.getList(userId, limit, offset);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
