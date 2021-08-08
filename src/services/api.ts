import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { signOut } from '../contexts/AuthContext';
import { RefreshTokenError } from '../utils/errors/RefreshTokenError';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {
    const apiAuth = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
            Authorization: `Bearer ${parseCookies(ctx)['myreadings.token']}`
        }
    });

    apiAuth.interceptors.response.use(
        responseSuccess => responseSuccess,
        (responseError: AxiosError) => {
            // console.log('responseError.response', responseError.response);
            if (responseError.response.status === 401) {
                if (responseError.response.data?.code === 'token.expired') {
                    const { 'myreadings.refreshToken': refreshToken } = parseCookies(ctx);
                    const originalConfig = responseError.config;

                    if (!isRefreshing) {
                        isRefreshing = true;
                        apiAuth.post('/auth/refresh', { refreshToken })
                            .then(response => {
                                // console.log(response);
                                const { refreshToken: newRefreshToken, token } = response.data;

                                setCookie(ctx, 'myreadings.token', token, {
                                    maxAge: 30 * 24 * 60 * 60, // 30 days
                                    path: '/'
                                });
                                setCookie(ctx, 'myreadings.refreshToken', newRefreshToken, {
                                    maxAge: 30 * 24 * 60 * 60, // 30 days
                                    path: '/'
                                });
                                apiAuth.defaults.headers['Authorization'] = `Bearer ${token}`;

                                failedRequestsQueue.forEach(request => request.onSuccess(token));
                                failedRequestsQueue = [];
                            })
                            .catch(err => {
                                failedRequestsQueue.forEach(request => request.onFailure(err));
                                failedRequestsQueue = [];
                                if (process.browser) {
                                    signOut();
                                } else {
                                    console.log('Chama erro');
                                    return Promise.reject(new RefreshTokenError());
                                }
                            })
                            .finally(() => isRefreshing = false)
                        ;
                    }
                    return new Promise((resolve, reject) => {
                        failedRequestsQueue.push({
                            onSuccess: (token: string) => {
                                // console.log('Chamando onSuccess:', {token, originalConfig});
                                originalConfig.headers['Authorization'] = `Bearer ${token}`;
                                resolve(api(originalConfig));
                            },
                            onFailure: (err: AxiosError) => {
                                // console.log('Chamando onFailure:', err);
                                reject(err);
                            },
                        })
                    });
                } else {
                    signOut();
                }
            }
            return Promise.reject(responseError);
        }
    );

    return apiAuth;
}

export const apiAuth = setupAPIClient();