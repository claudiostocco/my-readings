import { Box, SimpleGrid, Text, theme } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        foreColor: theme.colors.gray[500]
    },
    grid: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    xaxis: {
        type: 'datetime',
        axisBoder: {
            color: theme.colors.gray[600]
        },
        axisTicks: {
            color: theme.colors.gray[600]
        },
        categories: [
            '2021-03-18T00:00:00.000Z',
            '2021-03-19T00:00:00.000Z',
            '2021-03-20T00:00:00.000Z',
            '2021-03-21T00:00:00.000Z',
            '2021-03-22T00:00:00.000Z',
            '2021-03-23T00:00:00.000Z',
            '2021-03-24T00:00:00.000Z',
        ]
    },
    fill: {
        opacity: 0.3,
        type: 'gradient',
        gradient: {
            shade: 'dark',
            opacityFrom: 0.7,
            opacityTo: 0.3,
        }
    }
};

const series = [
    { name: 'series1', data: [25, 16, 27, 8, 16, 4, 15] }
]

export function Chart() {
    return (
        <SimpleGrid flex="1" gap="4" minChildWidth={320} align="flex-start">
        <Box
            p={["4", "8"]}
            bg="gray.800"
            borderRadius={8}
            pb={["1", "4"]}
        >
            <Text fontSize="lg" mb="4">Inscritos da semana</Text>
            <ApexChart options={options} series={series} type="area" height={160} />
        </Box>
        <Box
            p={["4", "8"]}
            bg="gray.800"
            borderRadius={8}
            pb={["1", "4"]}
        >
            <Text fontSize="lg" mb="4">Taxa de abertura</Text>
            <ApexChart options={options} series={series} type="area" height={160} />
        </Box>
    </SimpleGrid>
);
}