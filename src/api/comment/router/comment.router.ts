import express from "express";
import CommentController from "../controller/comment.controller";
export const commentRouter = express.Router();
import { DbCommentRepository } from "../repository/dbComment.repository";
import { CommentServicesImpl } from "../service/comment.service";
import { authRoleMiddleware } from "@/api/common/middlewares/authRole.middleware";

const COMMENT_ROUTES = {
  GET_COMMENTS: "/:article_id",
  GET_COMMENT_BY_ID: "/:article_id/:id",
  CREATE_COMMENT: "/:article_id",
  UPDATE_COMMENT: "/:article_id/:id",
  DELETE_COMMENT: "/:article_id/:id",
};

const commentController = new CommentController(
  new CommentServicesImpl(new DbCommentRepository())
);

commentRouter.get(COMMENT_ROUTES.GET_COMMENTS, commentController.getComments);
// commentRouter.get(
//   COMMENT_ROUTES.GET_COMMENT_BY_ID,
//   commentController.getCommentById
// );
commentRouter.post(
  COMMENT_ROUTES.CREATE_COMMENT,
  authRoleMiddleware(["user"]),
  commentController.createComment
);
commentRouter.put(
  COMMENT_ROUTES.UPDATE_COMMENT,
  commentController.updateComment
);
commentRouter.delete(
  COMMENT_ROUTES.DELETE_COMMENT,
  commentController.deleteComment
);
