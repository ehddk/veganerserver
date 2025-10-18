import { IComment } from "../@types/comment.api";
import { CommentResponseDTO } from "../dto/commentReponse.dto";

export interface CommentService {
  getComments(): Promise<CommentResponseDTO[]>;
  getCommentById(id: string): Promise<CommentResponseDTO | null>;
  createComment(
    comment: Pick<IComment, "content" | "author" | "author_id">
  ): Promise<CommentResponseDTO>;
  updateComment(
    id: string,
    commentInfo: Omit<
      IComment,
      "id" | "author_id" | "article_id" | "author" | "createdAt"
    >
  ): Promise<void>;
  deleteComment(id: string): Promise<void>;
}
