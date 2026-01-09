import { Request, Response } from "express";
import { createUserDto, loginUserDto } from "../dto/user.dto";
import { ApiError } from "../utils/apierror.utils";

import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";
import * as z from "zod";
import { AppDataSource } from "../config/typeorm.config";
import { UserEntity } from "../entity/user.entity";

import bcrypt from "bcryptjs";

const userRepo = AppDataSource.getRepository(UserEntity);

export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    type UserInfo = z.infer<typeof createUserDto>;
    const user = req.body;
    const reqBody = createUserDto.safeParse(user);
    if (!reqBody.success) {
      throw new ApiError(400, "invalid request", reqBody.error.issues);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(reqBody.data.password, salt);

    const createUser = userRepo.create({
      userName: reqBody.data.userName,
      email: reqBody.data.email,
      password: hashPassword,
    });
    const saveUser = await userRepo.save(createUser);
    const {
      password,
      createdAt,
      deletedAt,
      updatedAt,
      ...userWithoutPassword
    } = saveUser;
    res
      .status(200)
      .json({ message: `user created`, data: userWithoutPassword });
  }
);

export const logInUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const reqBody = loginUserDto.safeParse(req.body);
    if (!reqBody.success)
      throw new ApiError(400, "invalid Input", reqBody.error.issues);
    const user = await userRepo.findOne({
      where: { email: reqBody.data?.email },
    });
    if (!user) throw new ApiError(404, "invalid email or password");

    const comparePassword = await bcrypt.compare(
      reqBody.data.password,
      user.password
    );
    if (!comparePassword) throw new ApiError(404, "invalid email or password");

    const options = {
      httpOnly: true,
      secure: true,
    };
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30d",
      }
    );

    res
      .status(200)
      .cookie("accesstoken", token, options)
      .json({ message: "login success", name: user.userName, token });
  }
);
