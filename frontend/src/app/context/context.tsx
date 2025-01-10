import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

// Define User Context type
interface UserContextType {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

// Create User Context
const UserContext = createContext<UserContextType | null>(null);

// Custom Hook for accessing User Context
export const useUser = () => useContext(UserContext);

// User Provider Component
import { ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
