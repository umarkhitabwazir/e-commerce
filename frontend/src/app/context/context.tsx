import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { UserInterface } from "../utils/user.interface";



// Define User Context type
interface UserContextType {
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
}

// Create User Context
const UserContext = createContext<UserContextType | null>(null);

// Custom Hook for accessing User Context
export const useUser = () => useContext(UserContext);

// User Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};