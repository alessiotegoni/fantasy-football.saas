"use client";

import { Role } from "@/features/dashboard/user/utils/roles";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type DashboardRolesContextType = {
  user: User
  userRoles: Role[];
};

const DashboardRolesContext = createContext<DashboardRolesContextType | null>(
  null
);

type Props = {
  children: React.ReactNode;
  user: User
  userRoles: Role[];
};

export default function DashboardRolesProvider({ children, ...props }: Props) {
  return (
    <DashboardRolesContext.Provider
      value={{
        ...props,
      }}
    >
      {children}
    </DashboardRolesContext.Provider>
  );
}

export function useDashboardRoles() {
  const context = useContext(DashboardRolesContext);
  if (!context) {
    throw new Error(
      "useDashboardRoles must be used within DashboardRolesContext"
    );
  }
  return context;
}
