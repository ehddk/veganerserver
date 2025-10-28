type IReview = {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PaginatedReviews {
  items: IReview[];
  total: number;
}

export interface IReviewResponse {
  data: IReview[];
}
