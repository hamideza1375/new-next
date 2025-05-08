"use client"
import { useState, ReactNode } from "react";
import { AppContext } from "../appContext";

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  const [cartNumber, setcartNumber] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ cartNumber, setcartNumber }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;