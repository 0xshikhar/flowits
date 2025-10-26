'use client';

import { useState, useEffect } from 'react';
import { fcl } from '@/lib/flow/config';

export interface FlowUser {
  addr: string | null;
  loggedIn: boolean;
}

export function useFlowUser() {
  const [user, setUser] = useState<FlowUser>({ addr: null, loggedIn: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((currentUser: any) => {
      setUser({
        addr: currentUser.addr || null,
        loggedIn: currentUser.loggedIn || false,
      });
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await fcl.unauthenticate();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
