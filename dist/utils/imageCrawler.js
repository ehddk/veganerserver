"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlImages = crawlImages;
async function crawlImages(upsoName) {
    const images = await fetch(`https://openapi.naver.com/v1/search/image?query=${upsoName}+식당&display=2&start=1&sort=sim`, {
        headers: {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID || "",
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET || "",
        },
    });
    const json = await images.json();
    return json.items.map((item) => item.link);
}
//# sourceMappingURL=imageCrawler.js.map