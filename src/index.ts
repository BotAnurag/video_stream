import express, { urlencoded } from "express";
import { Request, Response } from "express";
import { job } from "./utils/cronjob";
import videoRouter from "./routes/video.routes";
import { AppDataSource } from "./config/typeorm.config";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(
  urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(express.static("uploads"));
app.use("/video", videoRouter);

app.get("/", (req: Request, res: Response): void => {
  res.send("i am up bro");
});

export default app;
