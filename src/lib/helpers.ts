export type ErrorResult = {
  error: true;
  message: string;
  data: null;
};

export type SuccessResult<T = {}> = {
  error: false;
  message: string;
  data: T;
};

export function createError(message: string): ErrorResult {
  return {
    error: true,
    message,
    data: null,
  };
}

export function createSuccess<T>(message = "", data: T): SuccessResult<T> {
  return {
    error: false,
    message,
    data,
  };
}
