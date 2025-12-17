import axios, { AxiosError } from 'axios';
import React, { PropsWithChildren, useState } from 'react';
import { AuthContext, Credentials } from './context';
import { AUTH } from '../../../../../shared/constants/endpoints';

const { VITE_API_URL } = import.meta.env;

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (data: Credentials) => {
    try {
      const res = await axios.post<{ accessToken: string }>(
        VITE_API_URL + AUTH.login,
        data,
      );

      setAccessToken(res.data.accessToken);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.log(err);
        // will implement it later
      }
    }
  };

  const value = {
    accessToken,
    login,
  };

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  );
};

export { AuthProvider };
