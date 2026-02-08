"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResServicesImpl = void 0;
const http_exception_1 = __importDefault(require("../../../api/common/exceptions/http.exception"));
const RestaurantResponse_dto_1 = require("../dto/RestaurantResponse.dto");
const res_model_1 = require("../model/res.model");
const API_PAGE_SIZE = 1000;
class ResServicesImpl {
    _resRepository;
    API_KEY = process.env.OPEN_API_KEY;
    constructor(resRepository) {
        this._resRepository = resRepository;
    }
    async getApiData(startIndex, endIndex) {
        const fullUrl = `http://openapi.seoul.go.kr:8088/${this.API_KEY}/json/CrtfcUpsoInfo/${startIndex}/${endIndex}`;
        const res = await fetch(fullUrl);
        if (!res.ok) {
            throw new Error(`openapi fetch failed:${res.status}`);
        }
        return res.json();
    }
    async saveAllOpenData() {
        let startIndex = 1;
        let totalCount = Infinity;
        const allRecords = [];
        while (startIndex <= totalCount) {
            const endIndex = startIndex + API_PAGE_SIZE - 1;
            try {
                const response = await this.getApiData(startIndex, endIndex);
                const info = response?.CrtfcUpsoInfo;
                const records = info?.row;
                if (!info || !records || records.length === 0) {
                    // 더 이상 데이터가 없거나 응답 구조 오류
                    console.log(`No records found at index ${startIndex}. Stopping.`);
                    break;
                }
                if (totalCount === Infinity) {
                    totalCount = info.list_total_count;
                }
                allRecords.push(...records);
                startIndex += API_PAGE_SIZE;
            }
            catch (error) {
                console.error(`Error fetching data at index ${startIndex}:`, error);
                // 에러 발생 시 반복문 중단
                break;
            }
        }
        const dbRecords = allRecords.map(res_model_1.mapOpenApiToDbModel);
        await this._resRepository.saveBatch(dbRecords);
    }
    async getRestaurants() {
        try {
            const values = await this._resRepository.findAll();
            return values;
        }
        catch (error) {
            throw new Error("목록 조회 중 오류 발생");
        }
    }
    async getRestaurantById(id) {
        try {
            const restaurant = await this._resRepository.findById(id);
            //console.log("service:::", restaurant);
            if (!restaurant) {
                throw new http_exception_1.default(404, "해당 음식점을 찾을 수 없습니다.");
            }
            return new RestaurantResponse_dto_1.RestaurantResponseDTO(restaurant);
        }
        catch (error) {
            throw new Error("음식점 조회 중 오류 발생");
        }
    }
    async createRestaurant(restaurant) {
        try {
            const newRestauantData = {
                ...restaurant,
                // source_id: null,
                latitude: 0,
                longitude: 0,
                ctfc_gbn_name: "USER",
            };
            const newRestaurant = await this._resRepository.save(newRestauantData);
            return new RestaurantResponse_dto_1.RestaurantResponseDTO(newRestaurant);
        }
        catch (error) {
            throw new Error("음식점 생성 중 오류 발생");
        }
    }
}
exports.ResServicesImpl = ResServicesImpl;
//# sourceMappingURL=res.service.js.map