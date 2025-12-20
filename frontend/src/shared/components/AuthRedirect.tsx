import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from "@/modules/Auth/context/AuthContext";

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

