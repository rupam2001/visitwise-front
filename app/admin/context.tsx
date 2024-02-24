// context.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import { JSONObject, getAuthHeaders, getTodayDateInUTC } from "../utils";
import { ENDPOINT } from "../constants";

// Define the type for your context value
type AdminContextType = {};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminContextProviderType {
  children: ReactNode;
}

export const AdminContextProvider: React.FC<AdminContextProviderType> = ({
  children,
}) => {
  return <AdminContext.Provider value={{}}>{children}</AdminContext.Provider>;
};

export const useAdminContext = (): AdminContextType => {
  // Create a custom hook to easily access the context value
  const contextValue = useContext(AdminContext);
  if (!contextValue) {
    throw new Error(
      "useAdminContext must be used within a AdminContextProvider"
    );
  }
  return contextValue;
};
