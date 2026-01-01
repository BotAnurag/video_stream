// import { unknown } from "zod";

// export class ApiError extends Error {
//   statusCode: Number;
//   data: any;
//   success: boolean;
//   error: unknown[];

//   constructor(
//     statusCode: Number,
//     message = "something wend wrong",
//     error = [],
//     stack = ""
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = null;
//     this.success = false;
//     this.error = error;

//   }
// }

export class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    // Fix prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    // Capture stack trace (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}
