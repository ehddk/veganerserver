import { PaginatedScraps } from "../@types/scrap.type";

export interface ScrapRepository {
  /** 토글: 있으면 삭제(false), 없으면 생성(true) */
  toggle(
    userId: string,
    restaurantId: number
  ): Promise<{ scrapped: boolean }>;

  /** 내 스크랩 목록 (페이지네이션) */
  findByUser(
    userId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedScraps>;

  /** 특정 식당이 현재 유저에게 스크랩 됐는지 */
  isScrappedBy(userId: string, restaurantId: number): Promise<boolean>;
}
