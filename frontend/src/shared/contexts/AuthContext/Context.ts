import { useSafeContext } from '@/shared/hooks/useSafeContext';
import { AsyncVoidFunction } from '@/shared/types/misc';
import { createContext } from 'react';

export type Credentials = { username: string, password: string };

type Props = {
  accessToken: string | null;
  login: (data: Credentials) => Promise<void>;
  logout: AsyncVoidFunction;
};

const AuthContext = createContext<Props | null>(null);
const useAuthContext = () => useSafeContext(AuthContext);

export { AuthContext, useAuthContext };
