import { ScrapRepository } from "../repository/scrap.repository";
import { PaginatedScraps } from "../@types/scrap.type";
import { ScrapService } from "./scrap.service.type";

export class ScrapServicesImpl implements ScrapService {
  private readonly _scrapRepository: ScrapRepository;

  constructor(scrapRepository: ScrapRepository) {
    this._scrapRepository = scrapRepository;
  }

  async toggle(
    userId: string,
    restaurantId: number
  ): Promise<{ scrapped: boolean }> {
    try {
      return await this._scrapRepository.toggle(userId, restaurantId);
    } catch (error) {
      throw new Error("스크랩 토글 중 오류 발생");
    }
  }

  async getList(
    userId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedScraps> {
    try {
      return await this._scrapRepository.findByUser(userId, limit, offset);
    } catch (error) {
      throw new Error("스크랩 목록 조회 중 오류 발생");
    }
  }
}
