export interface AppErrorOptions {
  isOperational?: boolean;
  details?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly isOperational: boolean;

  public readonly details?: unknown;

  constructor(statusCode: number, message: string, options: AppErrorOptions = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(includeStack = false) {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.details ? { details: this.details } : {}),
      ...(includeStack && this.stack ? { stack: this.stack } : {}),
    };
  }
}


