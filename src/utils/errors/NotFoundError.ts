import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super(404, `${resource} not found`, { details });
  }
}


