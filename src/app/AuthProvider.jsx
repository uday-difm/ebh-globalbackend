"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from './redux/actions/action';
import { Loader } from '../common/Loader';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        console.log('AuthProvider fetchAuthStatus data:', data);
        if (data.isAuthenticated) {
          dispatch(setAuth(
            data.isAuthenticated,
            data.user?.id,
            data.user?.name,
            data.user?.profile,
            data.user?.username,
            data.user?.profession,
            data.user?.email,
            data.user?.bio           
          ));
          console.log('AuthProvider dispatched setAuth with profile:', data.user?.profile);
        }
      } catch (error) {
        console.error('Failed to fetch auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, [dispatch]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
