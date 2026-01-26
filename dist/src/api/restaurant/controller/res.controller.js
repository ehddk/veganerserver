"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const http_exception_1 = __importDefault(require("@/api/common/exceptions/http.exception"));
class RestaurantController {
    _resService;
    constructor(resService) {
        this._resService = resService;
        this.getRestaurants = this.getRestaurants.bind(this);
        this.getRestaurantById = this.getRestaurantById.bind(this);
        this.createRestaurant = this.createRestaurant.bind(this);
    }
    async getRestaurants(req, res, next) {
        try {
            const values = await this._resService.getRestaurants();
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "목록 조회 중 오류");
        }
    }
    async getRestaurantById(req, res, next) {
        const { id } = req.params;
        try {
            const values = await this._resService.getRestaurantById(id);
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "음식점 조회 중 오류 발생");
        }
    }
    async createRestaurant(req, res, next) {
        try {
            const { upso_name, 
            /**도로명주소 */
            rdn_code, } = req.body;
            const values = await this._resService.createRestaurant({
                upso_name,
                rdn_code,
                /* open API인지 사용자인지 */
                source_type: "USER",
            });
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "음식점 조회 중 오류 발생");
        }
    }
}
exports.RestaurantController = RestaurantController;
//# sourceMappingURL=res.controller.js.map