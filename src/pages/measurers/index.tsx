import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link as ChakraLink } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import Link from 'next/link';
import { GetServerSideProps } from "next";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { SideBar } from "../../components/SideBar";
import { useMeasurers, getMeasurers } from "../../services/hooks/useMeasurers";
import { useState } from "react";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";

export default function MeasurerList() {
    const [ page, setPage ] = useState(1);

    const isLGScreen = useBreakpointValue({
        base: false,
        lg: true
    })
    const isMDScreen = useBreakpointValue({
        base: false,
        md: true
    })

    async function handlePrefetchMeasurer(measurerId: string) {
        await queryClient.prefetchQuery(['measurer', measurerId], async () => {
            const response = await api.get(`/measurers/${measurerId}`);

            return response.data;
        }, {
            staleTime: 10 * 60 * 1000, // 10 minutes
        });
    }

    // const { data, isLoading, isFetching , error } = useMeasurers(page, measurers);
    // const { data, isLoading, isFetching , error } = useMeasurers(page, {
    //     initialData: measurersData,
    // });
    const { data, isLoading, isFetching , error } = useMeasurers(page);

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
                <SideBar />
                <Box flex="1" borderRadius={8} bg="gray.800" p={["4","8"]}>
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Medidores
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                        </Heading>
                        <Link href="/measurers/form" passHref>
                            <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} fontSize="20" />}>
                                Criar novo
                            </Button>
                        </Link>
                    </Flex>
                    {isLoading ? (
                        <Flex justify="center" align="flex-end" h={100}>
                            <Spinner />
                        </Flex>
                    ) : error ? (
                        <Flex justify="center" align="flex-end" h={100}>
                            <Text>Falha ao obter dados!</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["2","4","6"]} color="gray.300" w="8">
                                            <Checkbox colorScheme="pink" />
                                        </Th>
                                        <Th>Medidor</Th>
                                        {isMDScreen && (<Th>Data cadastro</Th>)}
                                        <Th px={["1","4","6"]} w="8"></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {console.log(data)}
                                    {data.measurersData.map(measurer => (
                                        <Tr key={measurer.id}>
                                            <Td px={["2","4","6"]}>
                                                <Checkbox colorScheme="pink" />
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <ChakraLink color="purple.400" onMouseEnter={() => handlePrefetchMeasurer(measurer.id)}>
                                                        <Text fontWeight="bold">{measurer.title}</Text>
                                                    </ChakraLink>
                                                    <Text color="gray.300" fontSize="sm">{measurer.installationAddress}</Text>
                                                </Box>
                                            </Td>
                                            {isMDScreen && (<Td>{measurer.createdAt}</Td>)}
                                            <Td px={["1","4","6"]}>
                                                <Button
                                                    as="a"
                                                    size="sm"
                                                    fontSize="sm"
                                                    colorScheme="purple"
                                                    iconSpacing={isLGScreen ? 2 : 0}
                                                    leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                                                >
                                                    {isLGScreen && 'Editar'}
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            <Pagination
                                totalOfRegisters={data.totalCount}
                                currentPage={page}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </Box>
            </Flex>
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
   const measurers = await getMeasurers(1);
   console.log('measurers: ', measurers);
    return {
        props: {
            measurers
        }
    }
}