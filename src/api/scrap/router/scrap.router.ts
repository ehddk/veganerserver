import express from "express";
import { pool } from "@/config/database";
import { DbScrapRepository } from "../repository/dbScrap.repository";
import { ScrapServicesImpl } from "../service/scrap.service";
import ScrapController from "../controller/scrap.controller";
import { authRoleMiddleware } from "@/api/common/middlewares/authRole.middleware";

export const scrapRouter = express.Router();

const scrapController = new ScrapController(
  new ScrapServicesImpl(new DbScrapRepository(pool))
);

// 내 스크랩 목록 조회
scrapRouter.get("/", authRoleMiddleware(["user"]), scrapController.getList);

// 스크랩 토글
scrapRouter.post(
  "/:restaurant_id",
  authRoleMiddleware(["user"]),
  scrapController.toggle
);
