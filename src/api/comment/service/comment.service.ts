import HttpException from "@/api/common/exceptions/http.exception";
import {
  CommentResponseDTO,
  PaginatedCommentResponseDTO,
} from "../dto/commentReponse.dto";
import { CommentRepository } from "../repository/comment.repository";
import { CommentService } from "./comment.service.type";
import { IComment } from "../@types/comment.api";

export class CommentServicesImpl implements CommentService {
  private readonly _commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this._commentRepository = commentRepository;
  }
  async getComments(
    article_id: string,
    limit: number,
    offset: number
  ): Promise<PaginatedCommentResponseDTO> {
    try {
      const values = await this._commentRepository.findAll(
        article_id,

        limit,
        offset
      );
      return values;
    } catch (error) {
      throw new Error("목록 조회 중 실패");
    }
  }

  async getCommentById(id: string): Promise<CommentResponseDTO | null> {
    try {
      const comment = await this._commentRepository.findById(id);
      if (!comment) {
        throw new HttpException(404, "해당 댓글을 찾을 수 없습니다");
      }
      return new CommentResponseDTO(comment);
    } catch (error) {
      throw new Error("댓글 조회 중 오류 발생");
    }
  }

  async createComment(
    comment: Omit<IComment, "id" | "createdAt" | "updatedAt">
  ): Promise<CommentResponseDTO> {
    try {
      const newComment = await this._commentRepository.save(comment);
      console.log("neww", newComment);
      return new CommentResponseDTO(newComment);
    } catch (error) {
      throw new Error("생성 중 오류 발생");
    }
  }

  async updateComment(
    id: string,
    currentUserId: string,
    commentInfo: Omit<CommentResponseDTO, "id" | "user_id" | "createdAt">
  ): Promise<void> {
    try {
      const updatedComment = await this._commentRepository.update(
        id,
        currentUserId,
        commentInfo
      );
      console.log("updatedComment", updatedComment);
      if (!updatedComment) {
        throw new HttpException(404, "해당 댓글을 찾을 수 없습니다.");
      }
    } catch (error) {
      throw new Error("댓글 수정 중 오류 발생");
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      await this._commentRepository.delete(id);
    } catch (error) {
      throw new Error("댓글 삭제 중 오류 발생");
    }
  }
}
