import { UserEntity } from "../entity/user.entity";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserEntity, "password">;
    }
  }
}
