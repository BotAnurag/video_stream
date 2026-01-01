import { NextFunction, Request, Response } from "express";
import { success, ZodError } from "zod";
import { ApiError } from "../utils/apierror.utils";
import { QueryFailedError, TypeORMError } from "typeorm";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ success: false, message: "validation Fail", error: err });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors,
    });
  }
  if (err instanceof QueryFailedError) {
    console.log(err.driverError.code);
    console.log(err.name, err.message);
    console.log(err);
    const code = err.driverError.code;

    let message;
    switch (code) {
      case "23502":
        message = `incomplete required values `;
        break;
      case "23505":
        message = `duplicate value for ${err.driverError.detail}`;
        break;
    }

    return res.status(400).json({
      success: false,
      message: message || "query failed",
    });
  }

  if (err instanceof TypeORMError) {
    console.log(err.name);

    return res.status(404).json({
      success: false,
      message: "error form database",
    });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};

export default globalErrorHandler;
