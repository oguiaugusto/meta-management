import { ApiError } from '../utils/api/parseApiError';

export type AsyncVoidFunction = () => Promise<void>;

export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ChangeHandler = (e: ChangeEvent) => void;

export type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export type ApiFetchReturn = { ok: boolean; error?: ApiError };