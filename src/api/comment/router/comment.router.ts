import express from "express";
import CommentController from "../controller/comment.controller";
export const commentRouter = express.Router();
import { DbCommentRepository } from "../repository/dbComment.repository";
import { CommentServicesImpl } from "../service/comment.service";

const COMMENT_ROUTES = {
  GET_COMMENTS: "/",
  GET_COMMENT_BY_ID: "/:id",
  CREATE_COMMENT: "/",
  UPDATE_COMMENT: "/:id",
  DELETE_COMMENT: "/:id",
};

const commentController = new CommentController(
  new CommentServicesImpl(new DbCommentRepository())
);

commentRouter.get(COMMENT_ROUTES.GET_COMMENTS, commentController.getComments);
commentRouter.get(
  COMMENT_ROUTES.GET_COMMENT_BY_ID,
  commentController.getCommentById
);
commentRouter.post(
  COMMENT_ROUTES.CREATE_COMMENT,
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
