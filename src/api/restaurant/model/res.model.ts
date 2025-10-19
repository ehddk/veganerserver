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

export const mapOpenApiToDbModel = (
  apiRecord: any
): Omit<IRestaurant, "id"> => {
  // if (!apiRecord.TYPE || !apiRecord.START_INDEX || !apiRecord.END_INDEX) {
  //   throw new Error("openapi record missing required fields");
  // }

  const parseCoordinate = (coord: any): number => {
    // null, undefined, 빈 문자열 ("") 인지 확인
    if (!coord || String(coord).trim() === "") {
      return 0; // 또는 -1, 혹은 DB 컬럼이 NULL 허용 시 null로 처리
    }
    // parseFloat()으로 변환
    return parseFloat(coord);
  };

  return {
    //db 컬럼명 : api 필드명
    upso_name: apiRecord.UPSO_NM,
    rdn_code: apiRecord.RDN_CODE_NM || "",
    rdn_detail_addr: apiRecord.RDN_DETAIL_ADDR || "",
    source_id: String(apiRecord.CRTFC_UPSO_MGT_SNO),
    ctfc_gbn_name: apiRecord.CRTFC_GBN_NM || "",
    latitude: parseCoordinate(apiRecord.Y_DNTS),
    longitude: parseCoordinate(apiRecord.X_DNTS),
    category: apiRecord.BIZCND_CODE_NM,
    source_type: "OPEN_API",
  };
};
