type IRestaurant = {
  id?: string;
  /*업소명 */
  upso_name: string;
  /**도로명주소 */
  rdn_code: string;
  /*업종명*/
  cob_name?: string;

  /*업소번호 */
  upsoNum?: string;
  /*식품 인증 구분명  */
  ctfc_gbn_name: string;
  latitude?: number;
  longitude?: number;
  /*요청 시작 위치 */
  startIndex?: number;
  /*요청 종료 위치 */
  endIndex?: number;
  /* open API인지 사용자인지 */
  source_type?: "OPEN_API" | "USER";
  source_id?: string; // CRTFC_UPSO_MGT_SNO
  category?: string; // COB_CODE_NM,
  /*자치구명  */
  cgg_code_name?: string;
  /*전화번호 */
  tel_no?: string;
  /*이미지  */
  image_url?: string[];
};

/**조회 */
type getRestaurantsRequestPath = {};
type getRestaurantsRequestParams = {};
type getRestaurantsRequestBody = {};

type getRestaurantsRequest = {
  path?: getRestaurantsRequestPath;
  params?: getRestaurantsRequestParams;
  body?: getRestaurantsRequestBody;
};

type getRestaurantsResponse = IRestaurant[];

/*상세 조회 */
type getRestaurantRequestPath = { id: string };
type getRestaurantRequestParams = {};
type getRestaurantRequestBody = IRestaurant;

type getRestaurantRequest = {
  path: getRestaurantRequestPath;
  params?: getRestaurantRequestParams;
  body?: getRestaurantRequestBody;
};

type getRestaurantResponse = Pick<
  IRestaurant,
  | "id"
  | "upso_name"
  | "ctfc_gbn_name"
  | "rdn_code"
  | "category"
  | "cgg_code_name"
  | "tel_no"
>;

/* 생성 */

type createRestaurantPath = {};
type createRestaurantParams = {};
type createRestaurantBody = IRestaurant;

type createRestaurantRequest = {
  path?: createRestaurantPath;
  params?: createRestaurantParams;
  body: createRestaurantBody;
};

type createRestaurantResponse = IRestaurant;
