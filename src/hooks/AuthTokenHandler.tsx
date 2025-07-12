'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function AuthTokenHandler({ children }: { children: React.ReactNode }) {
    const { isSignedIn, getToken } = useAuth();
    console.log("isSignedIn", isSignedIn)
    console.log("getToken", getToken)
    useEffect(() => {
        const storeToken = async () => {
        if (isSignedIn) {
            const token = await getToken(); // default: 'clerk'
            if (token) {
            localStorage.setItem('auth_token', token);
            }
        } else {
            localStorage.removeItem('auth_token'); // limpia si se desloguea
        }
        };

        storeToken();
    }, [isSignedIn]);

    return <>{children}</>;
}
