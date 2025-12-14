import { ChangeHandler, SetStateFunction } from '@/shared/types/misc';

const getHandleChange = <T>(
  setState: SetStateFunction<T>,
  formatter?: (value: string) => string,
) => {
  const handleChange: ChangeHandler = (e) => {
    const { name, value, checked, type } = e.target;

    if (formatter) {
      setState((p) => ({
        ...p,
        [name]: type === 'checkbox' ? checked : formatter(value),
      }));
    } else {
      setState((p) => ({
        ...p,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  return handleChange;
};

export { getHandleChange };
