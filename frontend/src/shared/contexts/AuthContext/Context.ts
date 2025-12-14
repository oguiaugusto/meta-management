import { useSafeContext } from '@/shared/hooks/useSafeContext';
import { createContext } from 'react';

type Props = {
  accessToken: string | null;
};

const AuthContext = createContext<Props | null>(null);
const useAuthContext = () => useSafeContext(AuthContext);

export { AuthContext, useAuthContext };
