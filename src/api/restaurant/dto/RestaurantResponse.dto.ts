export class RestaurantResponseDTO {
  id?: string;
  /*업소명 */
  upso_name?: string;
  //   /*서비스명 */
  //   service?: string;
  /**자치구명 */
  cggName?: string;
  /*업종명*/
  cobName?: string;
  /**도로명주소 */
  rdnCode?: String;
  /**도로명 상세주소 */
  rdnDetailAddr?: string;
  /**식품인증구분명 */
  ctfc_gbn_name?: string;
  /*업소번호 */
  upsoNum?: string;
  /*식품 인증 구분명  */
  ctfcGbnName?: string;
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

  constructor(params: IRestaurant) {
    this.id = params.id;
    this.category = params.category;
    this.cggName = params.cggName;
    this.cobName = params.cobName;
    this.ctfcGbnName = params.ctfc_gbn_name;
    this.endIndex = params.endIndex;
    this.startIndex = params.startIndex;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.source_type = params.source_type;
    this.source_id = params.source_id;
    this.upso_name = params.upso_name;
    this.upsoNum = params.upsoNum;
  }
}
