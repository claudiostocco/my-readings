import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

import { api } from "../api";

export type User = {
    id: string
    name: string
    email: string
    createdAt: string
}

type GetUserResponse = {
    totalCount: number;
    usersData: User[];
}

export async function getUsers(page: number): Promise<GetUserResponse> {
    const { data, headers } = await api.get('/users', {
        params: {
            page,
        }
    });

    const totalCount = Number(headers['x-total-count']);
    const usersData = data.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
    }));
    return {
        usersData,
        totalCount,
    };
}

export function useUsers(page: number) {
    return useQuery(['users', page],() => getUsers(page), {
        staleTime: 30 * 1000, //30 seconds
    });
}
// export function useUsers(page: number, initialData: GetUserResponse, options?: UseQueryOptions) {
//     return useQuery(['users', page],() => getUsers(page), {
//         staleTime: 30 * 1000, //30 seconds
//         initialData,
//         ...options,
//     });
// }