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
      getCommentsRequest["params"],
      getCommentsRequest["body"],
      getCommentsResponse,
      getCommentsRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const article_id = req.params?.article_id;
      const rawLimit = req.query.limit;
      const rawOffset = req.query.offset;
      const parsedLimit = parseInt(
        Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "",
        10
      );
      const parsedOffset = parseInt(
        Array.isArray(rawOffset) ? rawOffset[0] : rawOffset || "",
        10
      );
      const limit: number =
        isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
      const offset: number =
        isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;

      // 순서 중요! 컨트롤러 -> 서비스 -> 리포지토리 함수 순서라서.. 일관성이 있는 순서여야함.
      const values = await this._commentService.getComments(
        article_id,
        offset,
        limit
      );
      res.status(200).json(values);
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
    const { id } = req.params;
    const currentUserId = req.user.userId;
    console.log("current 댓글 아이디", currentUserId);
    try {
      const values = await this._commentService.updateComment(
        id,
        currentUserId,
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
    const { article_id, id } = req.params;
    try {
      const values = await this._commentService.deleteComment(article_id, id);
      res.status(201).json(values);
    } catch (error) {
      throw new HttpException(404, "삭제 중 오류 발생");
    }
  }
}
