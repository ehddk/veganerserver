import { NextFunction, Request, Response } from "express";
import { CommentService } from "../service/comment.service.type";
import { createCommentRequest, createCommentResponse, deleteCommentRequest, getCommentsRequest, getCommentsResponse, updateCommentRequest, updateCommentResponse } from "../@types/comment.api";
export default class CommentController {
    private readonly _commentService;
    constructor(commentService: CommentService);
    getComments(req: Request<getCommentsRequest["params"], getCommentsRequest["body"], getCommentsResponse, getCommentsRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    createComment(req: Request<createCommentRequest["path"], createCommentResponse, createCommentRequest["body"], createCommentRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    updateComment(req: Request<updateCommentRequest["path"], updateCommentResponse, updateCommentRequest["body"], updateCommentRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    deleteComment(req: Request<deleteCommentRequest["path"], updateCommentResponse, deleteCommentRequest["body"], deleteCommentRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
}
