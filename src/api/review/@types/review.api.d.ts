type IReview = {
  id: string;
  user_id: string;
  user: string;
  restaurant_id: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

/**조회 */
type GetReviewRequestPath = {
  limit?: number;
  offset?: number;
};

type Path = GetReviewRequestPath;
type Params = { restaurant_id: string };
type Body = {};
type getReviewRequest = {
  path: Path;
  params: Params;
  body?: Body;
};

type getReviewResponse = IReview[];

/**생성 */
type createReviewRequestPath = { restaurant_id: string };
type createReviewRequestParams = {};
type createReviewRequestBody = {
  content: string;
  rating: number;
};

type createReviewRequest = {
  path: createReviewRequestPath;
  params?: createReviewRequestParams;
  body: createReviewRequestBody;
};

type createReviewResponse = IReview;
/**수정 */
type UpdateReviewRequestPath = { restaurant_id: string; id: string };
type UpdateReviewRequestParams = {};
type UpdateReviewRequestBody = {
  rating: number;
  content: string;
  updatedAt: Date;
};

type updateReviewRequest = {
  path: UpdateReviewRequestPath;
  params?: UpdateReviewRequestParams;
  body: UpdateReviewRequestBody;
};
type updateReviewResponse = true;
/**삭제 */
type DeleteReviewRequestPath = { id: string };

type DeleteReviewRequestParams = {};
type DeleteReviewRequestBody = {};
type DeleteReviewResponse = true;

type deleteReviewRequest = {
  path: DeleteReviewRequestPath;
  params?: DeleteReviewRequestParams;
  body?: DeleteReviewRequestBody;
};
type deleteReviewResponse = DeleteReviewResponse;
