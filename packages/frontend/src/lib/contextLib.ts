import { createContext, useContext, type Dispatch,type SetStateAction } from "react";

export interface AppContextType {
  isAuthenticated: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: any | null;
  setUser: Dispatch<SetStateAction<any | null>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  userHasAuthenticated: useAppContext,
  user: null,
  setUser: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}