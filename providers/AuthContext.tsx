'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Auth, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from 'utils/firebase';
import LoadingSpinner from 'components/LoadingSpinner';
import posthog from 'posthog-js';

// Define the type for the context value
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  auth: Auth;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);

      if (user) {
        posthog.identify(user.uid, {
          email: user.email,
          name: user.displayName,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />; 
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, auth }}>
      {children}
    </AuthContext.Provider>
  );
};
