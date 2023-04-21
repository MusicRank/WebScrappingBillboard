import express, { Application, Request, Response } from "express";
import schedule from "node-schedule";
import { AlbumData, getTopAlbumsFromBillboard } from "./puppeteer";

const app: Application = express();
const PORT: number = 3000;

let albums: AlbumData[] = [];

app.get(
  "/api/top-albums",
  async (req: Request, res: Response): Promise<Response> => {
    schedule.scheduleJob(
      "getTopAlbumsFromBillboard",
      "15 11 * * 2-3",
      async () => {
        albums = await getTopAlbumsFromBillboard();
      }
    );

    return res.status(200).send(albums);
  }
);

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
