import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { Header } from "../../components/Header";
import { SideBar } from "../../components/SideBar";
import { Input } from '../../components/Form/Input'
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";

type CreateUserFormData = {
    name: string
    email: string
    password: string
    password_confirmation: string
  }
  
  const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório!'),
    email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
    password: yup.string().required('Senha obrigatória!'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], 'As senhas precisam ser iguais!')
  })
  
  export default function UserList() {
    const router = useRouter();  
    const { formState, handleSubmit, register } = useForm({
        resolver: yupResolver(createUserFormSchema)
    });
    const { errors } = formState;
    const createUser = useMutation(async (user: CreateUserFormData) => {
        try {
            const response = await api.post('user', {
                user: {
                    ...user,
                    createdAt: new Date(),
                }
            });            
            return response.data.user;
        } catch (error) {
            console.log('catch', error);
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        }
    })

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await createUser.mutateAsync(values);
        if (createUser.isSuccess) {
            router.push('/users');
        } else {
            alert('Erro ao inserir usuário!');
        }
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px={["4","6"]}>
                <SideBar />
                <Box as="form" flex="1" borderRadius={8} bg="gray.800" p={["4","8"]} onSubmit={handleSubmit(handleCreateUser)}>
                    <Heading size="lg" fontWeight="normal">Criar usuários</Heading>
                    <Divider my="6" borderColor="gray.700" />
                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="name" label="Nome completo" error={errors.name} {...register('name')}/>
                            <Input name="email" type="email" label="E-mail" error={errors.email} {...register('email')} />
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="password" type="password" label="Senha" error={errors.password} {...register('password')} />
                            <Input name="password_confirmation" type="password" label="Confirmação da senha" error={errors.password_confirmation} {...register('password_confirmation')} />
                        </SimpleGrid>
                    </VStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
                            </Link>
                            <Button type="submit" colorScheme="pink" isLoading={formState.isSubmitting}>Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}