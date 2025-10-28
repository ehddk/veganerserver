export class ReviewResponseDTO {
  id: string;
  restaurant_id: string;
  user_id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(params: IReview) {
    this.id = params.id;
    this.restaurant_id = params.restaurant_id;
    this.user_id = params.user_id;
    this.content = params.content;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
export interface PaginatedReviewResponseDTO {
  items: ReviewResponseDTO[];
  total: number;
}
