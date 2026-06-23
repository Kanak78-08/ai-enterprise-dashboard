import { Navigate } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../redux/hooks";

type Props = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;