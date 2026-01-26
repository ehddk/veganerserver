import { CommentResponseDTO, PaginatedCommentResponseDTO } from "../dto/commentReponse.dto";
import { CommentRepository } from "../repository/comment.repository";
import { CommentService } from "./comment.service.type";
import { IComment } from "../@types/comment.api";
export declare class CommentServicesImpl implements CommentService {
    private readonly _commentRepository;
    constructor(commentRepository: CommentRepository);
    getComments(article_id: string, limit: number, offset: number): Promise<PaginatedCommentResponseDTO>;
    getCommentById(id: string): Promise<CommentResponseDTO | null>;
    createComment(comment: Omit<IComment, "id" | "createdAt" | "updatedAt">): Promise<CommentResponseDTO>;
    updateComment(id: string, currentUserId: string, commentInfo: Omit<CommentResponseDTO, "id" | "user_id" | "createdAt">): Promise<void>;
    deleteComment(article_id: string, id: string): Promise<void>;
}
