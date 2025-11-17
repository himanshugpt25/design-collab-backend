import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, message, { details });
  }
}


