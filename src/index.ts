import express, { urlencoded } from "express";
import { Request, Response } from "express";

import videoRouter from "./routes/video.routes";
import userRouter from "./routes/user.routes";

import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.middleware";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(
  urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(cors({ origin: "*", credentials: true }));

app.use("/uploads", express.static("uploads"));
app.use("/video", express.static("video"));
app.use("/video", videoRouter);

app.use("/user", userRouter);

app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response): void => {
  res.send("i am up bro");
});

export default app;
