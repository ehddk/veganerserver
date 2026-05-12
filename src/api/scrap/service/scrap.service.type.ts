import { PaginatedScraps } from "../@types/scrap.type";

export interface ScrapService {
  toggle(
    userId: string,
    restaurantId: number
  ): Promise<{ scrapped: boolean }>;

  getList(
    userId: string,
    limit: number,
    offset: number
  ): Promise<PaginatedScraps>;
}
