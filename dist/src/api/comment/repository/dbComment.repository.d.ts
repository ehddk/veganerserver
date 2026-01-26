import { CommentRepository } from "./comment.repository";
import { IComment, PaginatedComments } from "../@types/comment.api";
import { Pool } from "pg";
export declare class DbCommentRepository implements CommentRepository {
    private readonly pool;
    constructor(dbPool: Pool);
    save(comment: Omit<IComment, "id" | "createdAt" | "updatedAt">): Promise<IComment>;
    findAll(article_id: string, offset: number, limit: number): Promise<PaginatedComments>;
    findById(id: string): Promise<IComment | null>;
    update(id: string, currentUserId: string, comment: Partial<Omit<IComment, "id" | "createdAt" | "author_id">>): Promise<IComment | null>;
    delete(id: string): Promise<void>;
}
