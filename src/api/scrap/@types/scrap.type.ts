/** scrap 행 */
export interface IScrap {
  user_id: string;
  restaurant_id: number;
  created_at: Date;
}

/** 식당 + 스크랩 시점 (내 스크랩 목록 응답) */
export interface IScrappedRestaurant extends IRestaurant {
  scrapped_at: Date;
}

export interface PaginatedScraps {
  items: IScrappedRestaurant[];
  total: number;
}
