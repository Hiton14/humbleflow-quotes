import { useState, createContext, useContext, ReactNode } from 'react';
import { AppRole } from '@/types/database';

// Mock types
type User = { id: string; email?: string };
type Session = { user: User };

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRoles: AppRole[];
  isAdmin: boolean;
  isStaff: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock state: not logged in
  const [user] = useState<User | null>(null);
  const [session] = useState<Session | null>(null);
  const loading = false;
  const userRoles: AppRole[] = [];

  const signOut = async () => {
    console.log('Mock signOut');
  };

  const isAdmin = false;
  const isStaff = false;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userRoles,
      isAdmin,
      isStaff,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
