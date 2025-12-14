import React, { PropsWithChildren, useState } from 'react';
import { AuthContext } from './Context';

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = {
    accessToken,
  };

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  );
};

export { AuthProvider };

