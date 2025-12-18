import { AxiosError } from 'axios';

function parseAxiosError(err: any) {
  let error: string | undefined = 'Internal Server Error';
  let fields: Record<string, string> | undefined = undefined;

  if (err instanceof AxiosError) {
    if (err.response?.data) {
      if ('error' in err.response.data) {
        error = err.response.data.error;
      } else if ('fields' in err.response.data) {
        error = undefined;
        fields = err.response.data.fields;
      }
    }
  }

  return { error, fields };
};

export { parseAxiosError };
