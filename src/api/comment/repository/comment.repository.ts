import { IComment } from "../@types/comment.api";

export interface CommentRepository {
  /**목록 조회 */
  findAll(article_id: string): Promise<IComment[]>;
  findById(id: string): Promise<IComment | null>;
  save(
    Comment: Omit<IComment, "id" | "createdAt" | "updatedAt">
  ): Promise<IComment>;
  update(id: string, CommentInfo: Partial<IComment>): Promise<IComment | null>;
  delete(id: string): Promise<void>;
}
