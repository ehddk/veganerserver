export declare class ReviewResponseDTO {
    id: string;
    restaurant_id: string;
    user: string;
    user_id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    constructor(params: IReview);
}
export interface PaginatedReviewResponseDTO {
    items: ReviewResponseDTO[];
    total: number;
}
