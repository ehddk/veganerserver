"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleRouter = void 0;
const express_1 = __importDefault(require("express"));
const article_service_1 = require("../service/article.service");
const article_controller_1 = __importDefault(require("../controller/article.controller"));
const dbArticle_repository_1 = require("../repository/dbArticle.repository");
const authRole_middleware_1 = require("../../../api/common/middlewares/authRole.middleware");
exports.articleRouter = express_1.default.Router();
const ARTICLE_ROUTES = {
    GET_ARTICLES: "/api/articles",
    GET_ARTICLE_BY_ID: "/api/articles/:id",
    CREATE_ARTICLE: "/api/articles",
    UPDATE_ARTICLE: "/api/articles/:id",
    DELETE_ARTICLE: "/api/articles/:id",
};
const articleController = new article_controller_1.default(new article_service_1.ArticleServicesImpl(new dbArticle_repository_1.DbArticleRepository()));
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
exports.articleRouter.get("/", articleController.getArticles);
exports.articleRouter.get("/:id", articleController.getArticleById);
exports.articleRouter.post("/", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), articleController.createArticle);
exports.articleRouter.put("/:id", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), articleController.updateArticle);
exports.articleRouter.delete("/:id", (0, authRole_middleware_1.authRoleMiddleware)(["user"]), articleController.deleteArticle);
//# sourceMappingURL=article.router.js.map