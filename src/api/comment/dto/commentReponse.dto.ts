import { IComment } from "../@types/comment.api";

export class CommentResponseDTO {
  id: string;
  user_id?: string;
  content: string;
  user: string;
  createdAt: Date;
  updatedAt?: Date;
  userName?: string;

  constructor(params: IComment) {
    (this.id = params.id),
      (this.user_id = params.user_id),
      (this.content = params.content),
      (this.user = params.user),
      (this.createdAt = params.createdAt),
      (this.updatedAt = params.updatedAt);
    this.userName = params.userName;
  }
}

export interface PaginatedCommentResponseDTO {
  items: CommentResponseDTO[];
  total: number;
}
