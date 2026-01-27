"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServicesImpl = void 0;
const http_exception_1 = __importDefault(require("@/api/common/exceptions/http.exception"));
const commentReponse_dto_1 = require("../dto/commentReponse.dto");
class CommentServicesImpl {
    _commentRepository;
    constructor(commentRepository) {
        this._commentRepository = commentRepository;
    }
    async getComments(article_id, limit, offset) {
        try {
            const values = await this._commentRepository.findAll(article_id, limit, offset);
            return values;
        }
        catch (error) {
            throw new Error("목록 조회 중 실패");
        }
    }
    async getCommentById(id) {
        try {
            const comment = await this._commentRepository.findById(id);
            if (!comment) {
                throw new http_exception_1.default(404, "해당 댓글을 찾을 수 없습니다");
            }
            return new commentReponse_dto_1.CommentResponseDTO(comment);
        }
        catch (error) {
            throw new Error("댓글 조회 중 오류 발생");
        }
    }
    async createComment(comment) {
        try {
            const newComment = await this._commentRepository.save(comment);
            console.log("neww", newComment);
            return new commentReponse_dto_1.CommentResponseDTO(newComment);
        }
        catch (error) {
            throw new Error("생성 중 오류 발생");
        }
    }
    async updateComment(id, currentUserId, commentInfo) {
        try {
            const updatedComment = await this._commentRepository.update(id, currentUserId, commentInfo);
            console.log("updatedComment", updatedComment);
            if (!updatedComment) {
                throw new http_exception_1.default(404, "해당 댓글을 찾을 수 없습니다.");
            }
        }
        catch (error) {
            throw new Error("댓글 수정 중 오류 발생");
        }
    }
    async deleteComment(article_id, id) {
        try {
            await this._commentRepository.delete(id);
        }
        catch (error) {
            throw new Error("댓글 삭제 중 오류 발생");
        }
    }
}
exports.CommentServicesImpl = CommentServicesImpl;
//# sourceMappingURL=comment.service.js.map