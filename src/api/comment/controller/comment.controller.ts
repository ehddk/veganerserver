import { NextFunction, Request, Response } from "express";
import { CommentService } from "../service/comment.service.type";
import HttpException from "@/api/common/exceptions/http.exception";
import {
  createCommentRequest,
  createCommentResponse,
  deleteCommentRequest,
  getCommentsRequest,
  getCommentsResponse,
  updateCommentRequest,
  updateCommentResponse,
} from "../@types/comment.api";

export default class CommentController {
  private readonly _commentService: CommentService;
  constructor(commentService: CommentService) {
    this._commentService = commentService;

    this.getComments = this.getComments.bind(this);
    this.createComment = this.createComment.bind(this);
    // this.getCommentById = this.getCommentById.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async getComments(
    req: Request<
      getCommentsRequest["path"],
      getCommentsResponse,
      getCommentsRequest["body"],
      getCommentsRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const article_id = "1";
      const values = await this._commentService.getComments(article_id);
      res.status(200).json(values);
      console.log("valuessdsdsd", values);
    } catch (error) {
      throw new HttpException(404, "목록 조회 중 오류 발생");
    }
  }
  // async getCommentById(
  //   req: Request<
  //     ["path"],
  //     Comment.GetOne.Request["body"],
  //     Comment.GetOne.Request["params"],
  //     getCommentsResponse
  //   >,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { id } = req.params;
  //   try {
  //     const values = await this._commentService.getCommentById(id);
  //     res.status(200).json(values);
  //   } catch (error) {
  //     throw new HttpException(404, "상세 댓글 조회 중 오류 발생");
  //   }
  // }

  async createComment(
    req: Request<
      createCommentRequest["path"],
      createCommentResponse,
      createCommentRequest["body"],
      createCommentRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { article_id } = req.params;
      const { content } = req.body;

      const user_id = req.user.userId;
      console.log("reqqq::", user_id);
      const values = await this._commentService.createComment({
        content,
        article_id,
        user_id,
      });
      res.status(201).json(values);
    } catch (error) {
      console.error("❌ 댓글 생성 실패 - 상세 오류:", error);
      throw new HttpException(500, "생성 중 오류 발생");
    }
  }
  async updateComment(
    req: Request<
      updateCommentRequest["path"],
      updateCommentResponse,
      updateCommentRequest["body"],
      updateCommentRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { commentId } = req.params;
    const { content, updatedAt } = req.body;
    try {
      const values = await this._commentService.updateComment(
        commentId,
        req.body
      );
      res.status(201).json(values);
    } catch (error) {
      throw new HttpException(404, "생성 중 오류 발생");
    }
  }

  async deleteComment(
    req: Request<
      deleteCommentRequest["path"],
      updateCommentResponse,
      deleteCommentRequest["body"],
      deleteCommentRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { commentId } = req.params;
    try {
      const values = await this._commentService.deleteComment(commentId);
      res.status(201).json(values);
    } catch (error) {
      throw new HttpException(404, "삭제 중 오류 발생");
    }
  }
}
