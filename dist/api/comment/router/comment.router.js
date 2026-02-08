"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = __importDefault(require("../controller/comment.controller"));
exports.commentRouter = express_1.default.Router();
const dbComment_repository_1 = require("../repository/dbComment.repository");
const comment_service_1 = require("../service/comment.service");
const authRole_middleware_1 = require("../../../api/common/middlewares/authRole.middleware");
const database_1 = require("../../../config/database");
const COMMENT_ROUTES = {
    GET_COMMENTS: "/:article_id",
    GET_COMMENT_BY_ID: "/:article_id/:id",
    CREATE_COMMENT: "/:article_id",
    UPDATE_COMMENT: "/:article_id/:id",
    DELETE_COMMENT: "/:article_id/:id",
};
const commentController = new comment_controller_1.default(new comment_service_1.CommentServicesImpl(new dbComment_repository_1.DbCommentRepository(database_1.pool)));
exports.commentRouter.get(COMMENT_ROUTES.GET_COMMENTS, commentController.getComments);
// commentRouter.get(
//   COMMENT_ROUTES.GET_COMMENT_BY_ID,
//   commentController.getCommentById
// );
exports.commentRouter.post(COMMENT_ROUTES.CREATE_COMMENT, (0, authRole_middleware_1.authRoleMiddleware)(["user"]), commentController.createComment);
exports.commentRouter.put(COMMENT_ROUTES.UPDATE_COMMENT, (0, authRole_middleware_1.authRoleMiddleware)(["user"]), commentController.updateComment);
exports.commentRouter.delete(COMMENT_ROUTES.DELETE_COMMENT, (0, authRole_middleware_1.authRoleMiddleware)(["user"]), commentController.deleteComment);
//# sourceMappingURL=comment.router.js.map