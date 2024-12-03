'use client'
import React, { createContext, useState, useEffect,  ReactNode } from 'react';
import CryptoJS from 'crypto-js';
import { IUser } from '@/types/Types';


// Define the IUser interface


// Define the AuthContext type
export interface AuthContextType {
  user: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
  loading:boolean;
  isAuthenticated: () => boolean;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Encryption helpers
const SECRET_KEY = 'ehKNOc4NDRA25tzr/UO7rKyLG1YbMmqjrzMoy/lZTXw=';

const encryptData = (data: IUser): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext: string): IUser | null => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString) as IUser;
    } catch {
      return null; // Return null if decryption or parsing fails
    }
  };

// Key for localStorage
const USER_STORAGE_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(() => {
        const encryptedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (encryptedUser) {
          return decryptData(encryptedUser); // Returns IUser | null
        }
        return null; // No user stored
      });
      const [loading, setLoading] = useState<boolean>(true);
      

      useEffect(() => {
        if (user) {
          const encryptedUser = encryptData(user);
          localStorage.setItem(USER_STORAGE_KEY, encryptedUser);
          
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
        setLoading(false);
      }, [user]);

  const login = (user: IUser) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

