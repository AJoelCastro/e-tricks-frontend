'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import UserService from '@/services/UserService';

export default function AuthTokenHandler({ children }: { children: React.ReactNode }) {
    const { isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    useEffect(() => {
        const storeToken = async () => {
            if (isSignedIn) {
                const token = await getToken(); // default: 'clerk'
                if (token) {
                    localStorage.setItem('auth_token', token);
                    await UserService.verifyUser(token, user!.id)
                    localStorage.setItem('idClerk', user!.id)
                }
            } else {
                localStorage.removeItem('auth_token'); // limpia si se desloguea
                localStorage.removeItem('idClerk')
            }
        };

        storeToken();
    }, [isSignedIn]);

    return <>{children}</>;
}
