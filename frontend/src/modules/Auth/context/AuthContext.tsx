import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { parseApiError } from '@/shared/api/helpers/parseApiError';
import { ApiFetchReturn, AsyncVoidFunction } from '@/shared/types/misc';
import { PageSpinner } from '@/shared/components/PageSpinner';
import { loginRequest, logoutRequest, refreshRequest, registerRequest } from '@/modules/Auth/api/requests';
import { multiPending } from '@/shared/api/helpers/multiPending';
import { useSafeContext } from "@/shared/hooks/useSafeContext";
import { UserDTO } from "../types";

type Credentials = { username: string, password: string };

type ContextProps = {
  accessToken: string | null;
  authLoading: boolean;
  register: (data: UserDTO) => Promise<ApiFetchReturn>;
  login: (data: Credentials) => Promise<ApiFetchReturn>;
  logout: AsyncVoidFunction;
};

const AuthContext = createContext<ContextProps | null>(null);
const useAuthContext = () => useSafeContext(AuthContext);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const registerMutation = useMutation({ mutationFn: registerRequest });
  const loginMutation = useMutation({ mutationFn: loginRequest });
  const logoutMutation = useMutation({ mutationFn: logoutRequest });
  const refreshMutation = useMutation({ mutationFn: refreshRequest });

  const register = async (data: UserDTO): Promise<ApiFetchReturn> => {
    try {
      await registerMutation.mutateAsync(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: parseApiError(error) };
    }
  };

  const login = async (data: Credentials): Promise<ApiFetchReturn> => {
    try {
      const res = await loginMutation.mutateAsync(data);

      setAccessToken(res.accessToken);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: parseApiError(error) };
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setAccessToken(null);
  };

  const refreshOnLoad = async () => {
    try {
      const res = await refreshMutation.mutateAsync();
      setAccessToken(res.accessToken);
    } catch {
      setAccessToken(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshOnLoad();
  }, []);

  const value = {
    accessToken,
    authLoading,
    register,
    login,
    logout,
  };

  if (multiPending(refreshMutation, logoutMutation)) {
    return <PageSpinner />;
  }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
