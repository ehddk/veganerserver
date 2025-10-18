// type IRestaurant = {
//     id?: string;
//     /*업소명 */
//     upsoName?: string;
//     /*서비스명 */
//     service: string;
//     /**자치구명 */
//     cggName?: string;
//     /*업종명*/
//     cobName?: string;
//     /**도로명주소 */
//     rdnCode?: String;
//     /*업소번호 */
//     upsoNum?: string;
//     /*요청 시작 위치 */
//     startIndex: number;
//     /*요청 종료 위치 */
//     endIndex: number;
//     /* open API인지 사용자인지 */
//     source_type?: "OPEN_API" | "USER";
//     source_id?: string; // CRTFC_UPSO_MGT_SNO
//     category?: string; // COB_CODE_NM
//   };

const mapOpenApiToDbModel = (apiRecord: any): Omit<IRestaurant, "id"> => {
  if (!apiRecord.TYPE || !apiRecord.START_INDEX || !apiRecord.END_INDEX) {
    throw new Error("openapi record missing required fields");
  }
  return {
    //db 컬럼명 : api 필드명
    upsoName: apiRecord.UPSO_NM,
    rdnCode: apiRecord.RDN_CODE_NM,
    rdnDetailAddr: apiRecord.RDN_DETAIL_ADDR,
    ctfcGbnName: apiRecord.CRTFC_GBN_NM,
    latitude: parseInt(apiRecord.Y_DNTS),
    longitude: parseInt(apiRecord.X_DNTS),
    category: apiRecord.BIZCND_CODE_NM,
    source_type: "OPEN_API",
  };
};
