"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantResponseDTO = void 0;
class RestaurantResponseDTO {
    id;
    /*업소명 */
    upso_name;
    /*업종명*/
    cob_name;
    /**도로명주소 */
    rdn_code;
    /**식품인증구분명 */
    ctfc_gbn_name;
    /*업소번호 */
    upsoNum;
    latitude;
    longitude;
    /*요청 시작 위치 */
    startIndex;
    /*요청 종료 위치 */
    endIndex;
    /* open API인지 사용자인지 */
    source_type;
    source_id; // CRTFC_UPSO_MGT_SNO
    category; // COB_CODE_NM
    cgg_code_name;
    tel_no;
    image_url;
    constructor(params) {
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
        this.image_url = params.image_url;
    }
}
exports.RestaurantResponseDTO = RestaurantResponseDTO;
//# sourceMappingURL=RestaurantResponse.dto.js.map