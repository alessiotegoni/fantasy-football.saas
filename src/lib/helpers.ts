type ErrorResult = {
  error: true;
  message: string;
  data: null;
};

export function createError(message: string): ErrorResult {
  return {
    error: true,
    message,
    data: null,
  };
}

type SuccessResult<T = {}> = {
  error: false;
  message: string;
  data: T;
};

export function createSuccess<T>(data: T, message = ""): SuccessResult<T> {
  return {
    error: false,
    message,
    data,
  };
