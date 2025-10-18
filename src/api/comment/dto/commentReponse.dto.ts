import { IComment } from "../@types/comment.api";

export class CommentResponseDTO {
  id: string;
  author_id?: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(params: IComment) {
    (this.id = params.id),
      (this.author_id = params.author_id),
      (this.content = params.content),
      (this.author = params.author),
      (this.createdAt = params.createdAt),
      (this.updatedAt = params.updatedAt);
  }
}
