import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { apiAuth } from "../services/api";

type User = {
    email: string;
    permissions: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut: () => void;
    isAutenticated: boolean;
    user: User;
    messageError: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

let authChannel: BroadcastChannel;

export function signOut() {
    destroyCookie(undefined, 'myreadings.token');
    destroyCookie(undefined, 'myreadings.refreshToken');

    
    if (process.browser) {
        authChannel.postMessage('signOut');
        Router.push('/');
    }
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [ user, setUser ] = useState<User>();
    const [ messageError, setMessageError ] = useState('');
    const [ isAutenticated, setIsAutenticated ] = useState(!!user);

    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    signOut();
                    break;
                default:
                    break;
            }
        }
    }, []);

    useEffect(() => {
        const { 'myreadings.token': token } = parseCookies();
        if (token) {
            try {
                apiAuth.get('/me')
                    .then(response => {
                        const { email, permissions } = response.data;
                        setUser({ email, permissions });
                        setMessageError('');
                    })
                    .catch(error => console.log(error));
            } catch (error) {
                console.log(error);
                signOut();
            }
        }
    },[]);

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await apiAuth.post('/auth', {
                email,
                password,
            });
            const { permissions, refreshToken, token } = response.data;
            setUser({ email, permissions });
            setMessageError('');
            setIsAutenticated(true);
            console.log('ok');

            setCookie(undefined,'myreadings.token',token,{
                maxAge: 12 * 60 * 60, // 24 hous
                path: '/'
            });
            setCookie(undefined,'myreadings.refreshToken',refreshToken,{
                maxAge: 36 * 60 * 60, // 36 hours
                path: '/'
            });

            apiAuth.defaults.headers['Authorization'] = `Bearer ${token}`;
            console.log('ok - push');
            Router.push('/dashboard');
        } catch (error) {
            setUser(null);
            console.log(error.response.data);
            if (error.response.status === 401) {
                console.log('error.response.data.message:', error.response.data.message);
                setMessageError(error.response.data.message);
            }
        }
    }

    return (
        <AuthContext.Provider value={{isAutenticated, signIn, signOut, user, messageError}}>
            {children}
        </AuthContext.Provider>
    )
}