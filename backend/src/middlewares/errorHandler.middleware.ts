import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Global Error Handling Middleware for Express.
 * Express recognizes this as an error handler because it has exactly 4 parameters (err, req, res, next).
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error Caught by Global Handler:', err.message);

  // 1. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => issue.message),
    });
  }

  // 2. Handle Custom Business Logic Errors (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 3. Handle Unexpected Server Errors (Fallback)
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error. Please try again later.',
    // Only send the error stack trace in development mode for security reasons
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
};
