import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { Header } from "../components/Header";
import { Input } from '../components/Form/Input'
import { api } from "../services/api";
import { queryClient } from "../services/queryClient";

type NewClockFormData = {
    clockNumber: number;
    clockAddress: string;
    name?: string
    email: string
    password?: string
    password_confirmation?: string
  }
  
  const newClockFormSchema = yup.object().shape({
    clockNumber: yup.number().required('Número do medidor é obrigatório e pode ser encontrado na sua conta de energia!'),
    clockAddress: yup.string().required('Endereço de ligação do medidor é obrogatório'),
    name: yup.string().required('Nome obrigatório!'),
    email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
    password: yup.string().required('Senha obrigatória!'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], 'As senhas precisam ser iguais!')
  })
  
  export default function NewClock() {
    const router = useRouter();  
    const { formState, handleSubmit, register } = useForm({
        resolver: yupResolver(newClockFormSchema)
    });
    const { errors } = formState;
    const newClock = useMutation(async (user: NewClockFormData) => {
        try {
            const response = await api.post('clock', {
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
            queryClient.invalidateQueries('clocks');
        }
    })

    const handleNewClock: SubmitHandler<NewClockFormData> = async (values) => {
        await newClock.mutateAsync(values);
        if (newClock.isSuccess) {
            router.push('/');
        } else {
            alert('Erro ao inserir usuário!');
        }
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px={["4","6"]}>
                <Box as="form" flex="1" borderRadius={8} bg="gray.800" p={["4","8"]} onSubmit={handleSubmit(handleNewClock)}>
                    <Heading size="lg" fontWeight="normal">Criar relógio medidor</Heading>
                    <Divider my="6" borderColor="gray.700" />
                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="clockNumber" label="Número do medidor" error={errors.clockNumber} {...register('clockNumber')}/>
                            <Input name="clockAddress" label="Endereço do medidor" error={errors.clockAddress} {...register('clockAddress')} />
                        </SimpleGrid>
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
                            <Link href="/" passHref>
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