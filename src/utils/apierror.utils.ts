export class ApiError extends Error {
  statusCode: Number;
  data: any;
  success: boolean;
  error: any[];

  constructor(
    statusCode: Number,
    message = "something wend wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.error = error;
  }
}
