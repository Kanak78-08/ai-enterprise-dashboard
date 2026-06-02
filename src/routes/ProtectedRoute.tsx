import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../contexts/useAuth";

type Props = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;