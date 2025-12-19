import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthContext, Credentials } from './context';
import { parseApiError } from '@/shared/api/helpers/parseApiError';
import { ApiFetchReturn } from '@/shared/types/misc';
import { PageSpinner } from '@/shared/components/PageSpinner';
import { loginRequest, logoutRequest, refreshRequest } from '@/shared/api/auth';
import { multiPending } from '@/shared/api/helpers/multiPending';

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const loginMutation = useMutation({ mutationFn: loginRequest })
  const logoutMutation = useMutation({ mutationFn: logoutRequest })
  const refreshMutation = useMutation({ mutationFn: refreshRequest })

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
    } catch (err: any) {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    if (!accessToken) refreshOnLoad();
  }, []);

  const value = {
    accessToken,
    login,
    logout,
  };

  if (multiPending(refreshMutation, loginMutation, logoutMutation)) {
    return <PageSpinner />;
  }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  );
};

export { AuthProvider };
