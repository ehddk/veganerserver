import express from "express";
import { ArticleServicesImpl } from "../service/article.service";

import ArticleController from "../controller/article.controller";
import { DbArticleRepository } from "../repository/dbArticle.repository";
import { authRoleMiddleware } from "@/api/common/middlewares/authRole.middleware";
export const articleRouter = express.Router();

const ARTICLE_ROUTES = {
  GET_ARTICLES: "/api/articles",
  GET_ARTICLE_BY_ID: "/api/articles/:id",
  CREATE_ARTICLE: "/api/articles",
  UPDATE_ARTICLE: "/api/articles/:id",
  DELETE_ARTICLE: "/api/articles/:id",
};

const articleController = new ArticleController(
  new ArticleServicesImpl(new DbArticleRepository())
);

// articleRouter.get("/api/articles", articleController.getArticles);
// articleRouter.get(
//   ARTICLE_ROUTES.GET_ARTICLE_BY_ID,
//   articleController.getArticleById
// );
// articleRouter.post(
//   ARTICLE_ROUTES.CREATE_ARTICLE,
//   articleController.createArticle
// );
// articleRouter.put(
//   ARTICLE_ROUTES.UPDATE_ARTICLE,
//   articleController.updateArticle
// );
// articleRouter.delete(
//   ARTICLE_ROUTES.DELETE_ARTICLE,
//   articleController.deleteArticle
// );

articleRouter.get("/", articleController.getArticles);
articleRouter.get("/:id", articleController.getArticleById);
articleRouter.post(
  "/",
  authRoleMiddleware(["user"]),
  articleController.createArticle
);
articleRouter.put("/:id", articleController.updateArticle);
articleRouter.delete("/:id", articleController.deleteArticle);
