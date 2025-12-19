import { ApiFetchReturn, SetStateFunction } from '@/shared/types/misc';
import { toast } from 'sonner';

function handleApiError(
  res: ApiFetchReturn,
  setFieldErrors: SetStateFunction<Record<string, string>>,
  setAlertMessage: SetStateFunction<string>,
) {
  if (!res.ok && res.error) {
    switch (res.error.type) {
      case 'field':
        setFieldErrors(res.error.fields);
        break;
      case 'form':
        setAlertMessage(res.error.message);
        break;
      case 'unknown':
        toast.error(res.error.message, { className: 'error-toast' });
        break;
    }
    return;
  }
}

export { handleApiError };
