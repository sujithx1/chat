import { isAxiosError } from 'axios';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import z from 'zod';

export const Pretty_Error = (error: z.ZodError) => {
  return error.issues.map((issue) => {
    const field = issue.path.join('.') || 'root';
    return `${field}: ${issue.message}`;
  })[0];
};

// export const handleBadRequest=(c)=>{

// }

export class BaseError extends Error {
  statusCode: ContentfulStatusCode;
  errorCode: string;

  constructor(
    message: string,
    statusCode: ContentfulStatusCode,
    errorCode: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleAxiosError = (
  error: unknown
): { message: string; statusCode: ContentfulStatusCode } => {
  let message = '';
  let statusCode: ContentfulStatusCode = 500;
  if (isAxiosError(error)) {
    console.log(error.response?.data);
    statusCode = (error.response?.status as ContentfulStatusCode) || 500;
    message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      'Unknown error';
    return {
      message,
      statusCode,
    };
  }

  if (error instanceof Error) {
    message = error.message;
  }

  return {
    message,
    statusCode,
  };
};
