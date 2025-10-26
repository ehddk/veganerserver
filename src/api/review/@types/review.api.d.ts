type IReview = {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  content: string;
  created_at: Date;
  updated_at: Date;
};

/**조회 */
type Path = {};
type Params = {};
type Body = {};
type Request = {
  path?: Path;
  params?: Params;
  body?: Body;
};

type Response = IReview[];

/**생성 */
type Body = IReview;
type Path = {};
type Params = {};
type Request = {
  path?: Path;
  params?: Params;
  body: Body;
};

type Response = IReview;
/**수정 */
type UpdateReviewRequestPath = { id: string };
type UpdateReviewRequestParams = {};
type UpdateReviewRequestBody = {
  rating: number;
  content: string;
  updated_at: Date;
};

type Request = {
  path: UpdateReviewRequestPath;
  params?: UpdateReviewRequestParams;
  body: UpdateReviewRequestBody;
};
type Response = true;
/**삭제 */
type DeleteReviewRequestPath = { id: string };

type DeleteReviewRequestParams = {};
type DeleteReviewRequestBody = {};
type DeleteReviewResponse = true;

type Request = {
  path: DeleteReviewRequestPath;
  params?: DeleteReviewRequestParams;
  body?: DeleteReviewRequestBody;
};
type Response = DeleteReviewResponse;
