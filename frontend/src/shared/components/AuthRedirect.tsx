import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from "@/modules/Auth/context/AuthContext";
import { PageSpinner } from "./PageSpinner";

type Props = PropsWithChildren & {
  isProtected?: boolean;
};

const AuthRedirect: React.FC<Props> = ({ children, isProtected }) => {
  const { accessToken, authLoading } = useAuthContext();

  if (authLoading) {
    return <PageSpinner />;
  }

  if (isProtected && !accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtected && accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};


export { AuthRedirect };

