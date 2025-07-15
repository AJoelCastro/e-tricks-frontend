'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '@/store/slices/authSlice';
import UserService from '@/services/UserService';
import { SplashScreen } from '@/components/splash-screen';

export default function AuthTokenHandler({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storeToken = async () => {
      if(isLoaded){
        if (isSignedIn && user) {
          const token = await getToken();
          if (token) {
            dispatch(setAuth({ token, userId: user.id }));
            await UserService.verifyUser(token, user.id);
            setReady(true);
          }
        } else {
          dispatch(clearAuth());
          setReady(true);
        }
      }
    };

    storeToken();
  }, [isSignedIn, user, isLoaded]);

  if (!ready) return <SplashScreen />;
  return <>{children}</>;
}
