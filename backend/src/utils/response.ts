import { Response } from 'express';
import { ApiResponse } from '../types/common';

export class ApiResponseBuilder {
  static success<T>(res: Response, data?: T, message = 'Success', statusCode = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message = 'Error', statusCode = 500, errors?: string[]): void {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Success',
    statusCode = 200
  ): void {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },    };
    res.status(statusCode).json(response);
  }
}

export default ApiResponseBuilder;
