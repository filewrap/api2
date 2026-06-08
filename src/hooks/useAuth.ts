import { useState, useEffect } from 'react';
import { User } from '../types';

/**
 * useAuth Hook
 * Manages user authentication state for Streamify.
 * Implements a lightweight "Magic Link" or session-based persistence.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage or cookie
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('streamify_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // For prototype/zero-friction, we can auto-assign a guest ID if needed
          // userAuth.loginAsGuest();
        }
      } catch (error) {
        console.error('[Auth] Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string) => {
    console.log(`[Auth] Sending magic link to: ${email}`);
    // API call to apis.kailashhh.com/auth/magic-link
    return true;
  };

  const logout = () => {
    localStorage.removeItem('streamify_user');
    setUser(null);
  };

  return { user, isLoading, login, logout };
};
