import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apierror.utils";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/typeorm.config";
import { UserEntity } from "../entity/user.entity";

const userRepo = AppDataSource.getRepository(UserEntity);

export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token =
      req.cookies || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(404, "token unavailable");
    const decodeToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const user = await userRepo.findOneOrFail({
      where: {
        id: decodeToken.id,
      },
    });
    if (!user) throw new ApiError(404, "user not found please login again ");

    const { password, ...userWithoutPassword } = user;

    req.user = userWithoutPassword;

    next();
  }
);
