import { IComment } from "../@types/comment.api";
export declare class CommentResponseDTO {
    id: string;
    user_id?: string;
    content: string;
    user: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(params: IComment);
}
export interface PaginatedCommentResponseDTO {
    items: CommentResponseDTO[];
    total: number;
}
