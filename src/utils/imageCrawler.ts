export async function crawlImages(upsoName: string): Promise<string[]> {
  const images = await fetch(
    `https://openapi.naver.com/v1/search/image?query=${upsoName}&display=2&start=1&sort=sim`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID || "",
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET || "",
      },
    }
  );
  const json = await images.json();
  console.log("네이버 응답:", json);
  return json.items.map((item: any) => item.link);
}
