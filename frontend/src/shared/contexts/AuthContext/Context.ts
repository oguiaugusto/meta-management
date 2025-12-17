import { useSafeContext } from '@/shared/hooks/useSafeContext';
import { createContext } from 'react';

export type Credentials = { username: string, password: string };

type Props = {
  accessToken: string | null;
  login: (data: Credentials) => Promise<void>;
};

const AuthContext = createContext<Props | null>(null);
const useAuthContext = () => useSafeContext(AuthContext);

export { AuthContext, useAuthContext };
