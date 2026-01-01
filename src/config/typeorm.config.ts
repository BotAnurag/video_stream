import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import { DataSource } from "typeorm";
import { videoEntity } from "../entity/video.entity";
import { UserEntity } from "../entity/user.entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [videoEntity, UserEntity],
  synchronize: true,
});
