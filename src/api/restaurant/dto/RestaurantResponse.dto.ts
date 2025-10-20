export class RestaurantResponseDTO {
  id?: string;
  /*업소명 */
  upso_name?: string;
  /*업종명*/
  cob_name?: string;
  /**도로명주소 */
  rdn_code?: String;
  /**식품인증구분명 */
  ctfc_gbn_name?: string;
  /*업소번호 */
  upsoNum?: string;
  latitude?: number;
  longitude?: number;
  /*요청 시작 위치 */
  startIndex?: number;
  /*요청 종료 위치 */
  endIndex?: number;
  /* open API인지 사용자인지 */
  source_type?: "OPEN_API" | "USER";
  source_id?: string | null; // CRTFC_UPSO_MGT_SNO
  category?: string; // COB_CODE_NM
  cgg_code_name?: string;
  tel_no?: string;

  constructor(params: IRestaurant) {
    this.id = params.id;
    this.category = params.category;
    this.rdn_code = params.rdn_code;
    this.cob_name = params.cob_name;
    this.ctfc_gbn_name = params.ctfc_gbn_name;
    this.endIndex = params.endIndex;
    this.startIndex = params.startIndex;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.source_type = params.source_type;
    this.source_id = params.source_id;
    this.upso_name = params.upso_name;
    this.upsoNum = params.upsoNum;
    this.cgg_code_name = params.cgg_code_name;
    this.tel_no = params.tel_no;
  }
}
