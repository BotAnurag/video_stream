import express from "express";
import { Request, Response } from "express";
import { job } from "./utils/cronjob";
import videoRouter from "./routes/video.routes";

const app = express();
app.use("/video", videoRouter);

app.get("/", (req: Request, res: Response): void => {
  res.send("i am up bro");
});
job;
app.listen(3000, () => {
  console.log("server running");
});
