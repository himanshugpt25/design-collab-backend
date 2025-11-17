import { AppError } from './AppError';

export interface ValidationErrorItem {
  path: string | string[];
  message: string;
}

export class ValidationError extends AppError {
  public readonly errors: ValidationErrorItem[];

  constructor(errors: ValidationErrorItem[], message = 'Validation Error') {
    super(400, message, { details: errors });
    this.errors = errors;
  }

  override toJSON(includeStack = false) {
    return {
      ...super.toJSON(includeStack),
      errors: this.errors,
    };
  }
}


