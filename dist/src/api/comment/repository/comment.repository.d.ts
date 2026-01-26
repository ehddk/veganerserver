import { IComment, PaginatedComments } from "../@types/comment.api";
export interface CommentRepository {
    /**목록 조회 */
    findAll(article_id: string, limit: number, offset: number): Promise<PaginatedComments>;
    findById(id: string): Promise<IComment | null>;
    save(Comment: Omit<IComment, "id" | "createdAt" | "updatedAt">): Promise<IComment>;
    update(id: string, currentUserId: string, CommentInfo: Partial<IComment>): Promise<IComment | null>;
    delete(id: string): Promise<void>;
}
