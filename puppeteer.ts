import puppeteer, {
  Browser,
  ElementHandle,
  Page,
  executablePath,
} from "puppeteer";

export type AlbumData = {
  album: string | undefined;
  artist: string | undefined;
  cover: null;
};

export const getTopAlbumsFromBillboard = async (): Promise<AlbumData[]> => {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });

  const page: Page = await browser.newPage();

  await page.goto("https://www.billboard.com/charts/billboard-200/", {
    timeout: 0,
  });

  const elements: ElementHandle<Element>[] = await page.$$(
    `[id="title-of-a-story"]`
  );

  const albumList: AlbumData[] = [];

  for (let i = 4; i < Math.min(23, elements.length); i++) {
    if (i % 2 === 0) {
      const album: string | undefined = await elements[i].evaluate((node) =>
        node.textContent?.trim()
      );
      const artist: string | undefined = await elements[i].evaluate((node) =>
        node.nextElementSibling?.textContent?.trim()
      );

      const albumData: AlbumData = {
        album,
        artist,
        cover: null,
      };

      albumList.push(albumData);
    }
  }

  await browser.close();

  return albumList;
};
