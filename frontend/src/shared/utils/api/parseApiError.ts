import { isAxiosError } from 'axios';

export type ApiError =
  | { type: 'field'; fields: Record<string, string> }
  | { type: 'form'; message: string }
  | { type: 'unknown'; message: string };

function parseApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return { type: 'unknown', message: 'Unexpected error' };
  }
  if (!error.response) {
    return { type: 'unknown', message: 'Cannot connect to server' };
  }

  const data = error.response.data;

  if (data?.fields) {
    return { type: 'field', fields: data.fields };
  }
  if (data?.message) {
    return { type: 'form', message: data.message };
  }

  return { type: 'unknown', message: 'Server error' };
};

export { parseApiError };
