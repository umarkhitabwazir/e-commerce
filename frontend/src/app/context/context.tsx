import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
  address: string;
  phone: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

// Define User Context type
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create User Context
const UserContext = createContext<UserContextType | null>(null);

// Custom Hook for accessing User Context
export const useUser = () => useContext(UserContext);

// User Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};