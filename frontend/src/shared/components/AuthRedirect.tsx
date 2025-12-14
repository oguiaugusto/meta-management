import React, { PropsWithChildren } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router';

type Props = PropsWithChildren & {
  isProtected?: boolean;
};

const AuthRedirect: React.FC<Props> = ({ children, isProtected }) => {
  const { accessToken } = useAuthContext();

  if (isProtected && !accessToken) {
    return <Navigate to="/login" />;
  }

  if (!isProtected && accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export { AuthRedirect };

