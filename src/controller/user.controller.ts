import { Request, Response } from "express";
import { createUserDto } from "../dto/user.dto";
import { ApiError } from "../utils/apierror.utils";
import { ZodError } from "zod";
import asyncHandler from "express-async-handler";

import * as z from "zod";
import { AppDataSource } from "../config/typeorm.config";
import { UserEntity } from "../entity/user.entity";

const userRepo = AppDataSource.getRepository(UserEntity);

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    type UserInfo = z.infer<typeof createUserDto>;
    const user = req.body;
    const reqBody = createUserDto.safeParse(user);
    if (!reqBody.success) {
      throw new ApiError(400, "invalid request", reqBody.error.issues);
    }

    const createUser = userRepo.create({ ...reqBody.data });
    const saveUser = await userRepo.save(createUser);
    res.status(200).json({ message: `user created`, data: saveUser });
  }
);
