import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

import { formatDate } from "@/src/utils/formats";
import { api } from "../api";
import { MeasurerData } from "../database/types";

type GetMeasurersResponse = {
    totalCount: number;
    measurersData: MeasurerData[];
}

export async function getMeasurers(page: number): Promise<GetMeasurersResponse> {
    const { data, headers } = await api.get('/measurers', {
        params: {
            page,
        }
    });
    const totalCount = Number(headers['x-total-count']);
    const measurersData = data.map((measurer) => ({
        id: measurer._id,
        title: measurer.title,
        number: measurer.number,
        installationAddress: measurer.installationAddress,
        email: measurer.email,
        createdAt: formatDate(new Date(measurer.createdAt)),
    }));
    return {
        measurersData,
        totalCount,
    };
}

export function useMeasurers(page: number) {
    return useQuery(['measurers', page],() => getMeasurers(page), {
        staleTime: 60 * 1000, //60 seconds
    });
}