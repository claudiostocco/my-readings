import { Box, Button, Checkbox, Flex, Heading, Icon, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue, Link as ChakraLink } from "@chakra-ui/react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import Link from 'next/link';
import { GetServerSideProps } from "next";

import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { SideBar } from "../../components/SideBar";
import { useUsers, getUsers } from "../../services/hooks/useUsers";
import { useState } from "react";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";

export default function UserList() {
    const [ page, setPage ] = useState(1);

    const isLGScreen = useBreakpointValue({
        base: false,
        lg: true
    })
    const isMDScreen = useBreakpointValue({
        base: false,
        md: true
    })

    async function handlePrefetchUser(userId: string) {
        await queryClient.prefetchQuery(['user', userId], async () => {
            const response = await api.get(`/users/${userId}`);

            return response.data;
        }, {
            staleTime: 10 * 60 * 1000, // 10 minutes
        });
    }

    // const { data, isLoading, isFetching , error } = useUsers(page, users);
    // const { data, isLoading, isFetching , error } = useUsers(page, {
    //     initialData: usersData,
    // });
    const { data, isLoading, isFetching , error } = useUsers(page);

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
                <SideBar />
                <Box flex="1" borderRadius={8} bg="gray.800" p={["4","8"]}>
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
                        </Heading>
                        <Link href="/users/create" passHref>
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
                            <Text>Falha ao obter dados do usuário!</Text>
                        </Flex>
                    ) : (
                        <>
                            <Table colorScheme="whiteAlpha">
                                <Thead>
                                    <Tr>
                                        <Th px={["2","4","6"]} color="gray.300" w="8">
                                            <Checkbox colorScheme="pink" />
                                        </Th>
                                        <Th>Usuário</Th>
                                        {isMDScreen && (<Th>Data cadastro</Th>)}
                                        <Th px={["1","4","6"]} w="8"></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.usersData.map(user => (
                                        <Tr key={user.id}>
                                            <Td px={["2","4","6"]}>
                                                <Checkbox colorScheme="pink" />
                                            </Td>
                                            <Td>
                                                <Box>
                                                    <ChakraLink color="purple.400" onMouseEnter={() => handlePrefetchUser(user.id)}>
                                                        <Text fontWeight="bold">{user.name}</Text>
                                                    </ChakraLink>
                                                    <Text color="gray.300" fontSize="sm">{user.email}</Text>
                                                </Box>
                                            </Td>
                                            {isMDScreen && (<Td>{user.createdAt}</Td>)}
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

// export const getServerSideProps: GetServerSideProps = async () => {
//    const users = await getUsers(1);
//     return {
//         props: {
//             users
//         }
//     }
// }