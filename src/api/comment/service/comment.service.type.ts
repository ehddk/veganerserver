import { IComment } from "../@types/comment.api";
import {
  CommentResponseDTO,
  PaginatedCommentResponseDTO,
} from "../dto/commentReponse.dto";

export interface CommentService {
  getComments(
    article_id: string,
    limit: number,
    offset: number
  ): Promise<PaginatedCommentResponseDTO>;
  getCommentById(id: string): Promise<CommentResponseDTO | null>;
  createComment(
    comment: Omit<IComment, "id" | "user" | "createdAt" | "updatedAt">
  ): Promise<CommentResponseDTO>;
  updateComment(
    id: string,
    commentInfo: Omit<
      IComment,
      "id" | "user_id" | "article_id" | "user" | "createdAt"
    >
  ): Promise<void>;
  deleteComment(id: string): Promise<void>;
}
