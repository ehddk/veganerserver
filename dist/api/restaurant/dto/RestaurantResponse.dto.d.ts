export declare class RestaurantResponseDTO {
    id?: string;
    upso_name?: string;
    cob_name?: string;
    /**도로명주소 */
    rdn_code?: String;
    /**식품인증구분명 */
    ctfc_gbn_name?: string;
    upsoNum?: string;
    latitude?: number;
    longitude?: number;
    startIndex?: number;
    endIndex?: number;
    source_type?: "OPEN_API" | "USER";
    source_id?: string | null;
    category?: string;
    cgg_code_name?: string;
    tel_no?: string;
    image_url?: string[];
    constructor(params: IRestaurant);
}
