'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import UserService from '@/services/UserService';
import { SplashScreen } from '@/components/splash-screen'
export default function AuthTokenHandler({ children }: { children: React.ReactNode }) {
    const { isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const storeToken = async () => {
            if (isSignedIn) {
                const token = await getToken(); // default: 'clerk'
                if (token) {
                    localStorage.setItem('auth_token', token);
                    await UserService.verifyUser(token, user!.id)
                    localStorage.setItem('idClerk', user!.id)
                    setReady(true);

                }
            } else {
                localStorage.removeItem('auth_token'); // limpia si se desloguea
                localStorage.removeItem('idClerk')
                setReady(true);
            }
        };

        storeToken();
    }, [isSignedIn]);
    if(!ready){
        return (<SplashScreen/>)
    }
    return <>{children}</>;
}
