import express, { RequestHandler } from "express";
import { ArticleServicesImpl } from "../service/article.service";

import ArticleController from "../controller/article.controller";
import { DbArticleRepository } from "../repository/dbArticle.repository";
import { authRoleMiddleware } from "@/api/common/middlewares/authRole.middleware";
export const articleRouter = express.Router();

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
articleRouter.get("/author/:author_id", articleController.getArticleByAuthorId);
articleRouter.post(
  "/",
  authRoleMiddleware(["user"]),
  articleController.createArticle
);
articleRouter.put(
  "/:id",
  authRoleMiddleware(["user"]),
  articleController.updateArticle
);
articleRouter.delete(
  "/:id",
  authRoleMiddleware(["user"]),
  articleController.deleteArticle as unknown as RequestHandler
);
