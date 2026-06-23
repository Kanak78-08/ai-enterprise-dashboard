import React from "react";

import { useAppSelector } from "../redux/hooks";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { role } = useAppSelector((state) => state.auth);

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
