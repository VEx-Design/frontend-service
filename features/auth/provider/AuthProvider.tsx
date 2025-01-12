"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { User } from "../types/user";
import currentUser from "../actions/user";

interface UserContextType {
  isSignedIn: boolean;
  user: User | undefined;
  isLoaded: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setUser: (user: User | undefined) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <UserContext.Provider
      value={{
        isSignedIn,
        user,
        isLoaded,
        setIsSignedIn,
        setUser,
        setIsLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): {
  isSignedIn: boolean;
  user: User | undefined;
  isLoaded: boolean;
} => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  const { isSignedIn, user, isLoaded, setUser, setIsSignedIn, setIsLoaded } =
    context;

  // Fetch user data if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      currentUser()
        .then((user) => {
          if (user) {
            setUser(user);
            setIsSignedIn(true);
          } else {
            setIsSignedIn(false);
          }
        })
        .catch(() => {
          setIsSignedIn(false);
        })
        .finally(() => {
          setIsLoaded(true);
        });
    }
  }, [isSignedIn, setIsSignedIn, setUser, setIsLoaded]);

  return { isSignedIn, user, isLoaded };
};

export { AuthProvider, useUser };
