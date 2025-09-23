import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import emailjs from '@emailjs/browser';
import { hashPassword, verifyPassword, isPasswordHashed } from '@/lib/crypto';

interface AdminCredentials {
  username: string;
  password: string;
  email: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (credentials: Partial<AdminCredentials>) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  getCredentials: () => Promise<AdminCredentials | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_credentials';
const SESSION_KEY = 'admin_session';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.expiry > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const getCredentials = async (): Promise<AdminCredentials | null> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Set default credentials if none exist - hash the default password
      const hashedPassword = await hashPassword('admin123');
      const defaultCredentials: AdminCredentials = {
        username: 'admin',
        password: hashedPassword,
        email: 'cloudyskybd48@gmail.com'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCredentials));
      return defaultCredentials;
    }
    
    const credentials = JSON.parse(stored);
    
    // Migration: If password is not hashed, hash it
    if (credentials.password && !isPasswordHashed(credentials.password)) {
      console.log('Migrating plain text password to hashed password...');
      const hashedPassword = await hashPassword(credentials.password);
      credentials.password = hashedPassword;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    }
    
    return credentials;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const credentials = await getCredentials();
    if (!credentials) return false;

    const isValidPassword = await verifyPassword(password, credentials.password);
    
    if (credentials.username === username && isValidPassword) {
      // Create session that expires in 24 hours
      const session = {
        authenticated: true,
        expiry: Date.now() + (24 * 60 * 60 * 1000)
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  const updateCredentials = async (newCredentials: Partial<AdminCredentials>) => {
    const current = await getCredentials();
    if (current) {
      // If password is being updated, hash it
      const updated = { ...current, ...newCredentials };
      if (newCredentials.password && !isPasswordHashed(newCredentials.password)) {
        updated.password = await hashPassword(newCredentials.password);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const credentials = await getCredentials();
    if (!credentials) return false;

    const isCurrentPasswordValid = await verifyPassword(currentPassword, credentials.password);
    if (!isCurrentPasswordValid) {
      return false;
    }

    await updateCredentials({ password: newPassword });
    return true;
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    const credentials = await getCredentials();
    if (!credentials || credentials.email !== email) {
      return false;
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + (1 * 60 * 60 * 1000); // 1 hour

    updateCredentials({ resetToken, resetTokenExpiry });

    try {
      // Send email using EmailJS
      await emailjs.send(
        'YOUR_SERVICE_ID', // User needs to configure this
        'YOUR_TEMPLATE_ID', // User needs to configure this
        {
          to_email: email,
          reset_link: `${window.location.origin}/auth?reset=${resetToken}`,
          to_name: 'Admin'
        },
        'YOUR_PUBLIC_KEY' // User needs to configure this
      );
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    const credentials = await getCredentials();
    if (!credentials || !credentials.resetToken || !credentials.resetTokenExpiry) {
      return false;
    }

    if (credentials.resetToken === token && credentials.resetTokenExpiry > Date.now()) {
      await updateCredentials({ 
        password: newPassword, 
        resetToken: undefined, 
        resetTokenExpiry: undefined 
      });
      return true;
    }
    return false;
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      loading,
      login,
      logout,
      updateCredentials,
      sendPasswordReset,
      resetPassword,
      getCredentials,
      changePassword
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};