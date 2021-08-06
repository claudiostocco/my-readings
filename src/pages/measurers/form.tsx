import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import Link from 'next/link';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { Header } from "../../components/Header";
import { Input } from '../../components/Form/Input'
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { MeasurerData, UserData } from "../../services/database/types";

type NewMeasurerFormData = {
    title: string;
    number: number;
    installationAddress: string;
    name?: string
    email: string
    password?: string
    password_confirmation?: string
  }
  
  const newMeasurerFormSchema = yup.object().shape({
    title: yup.string().required('Titulo é obrigatório!'),
    number: yup.number().required('Número do medidor é obrigatório e pode ser encontrado na sua conta de energia!'),
    installationAddress: yup.string().required('Endereço de ligação do medidor é obrogatório'),
    name: yup.string().required('Nome obrigatório!'),
    email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
    password: yup.string().required('Senha obrigatória!'),
    password_confirmation: yup.string().oneOf([
        null, yup.ref('password')
    ], 'As senhas precisam ser iguais!')
  })
  
  export default function NewMeasurer() {
    const router = useRouter();  
    const toast = useToast();
    const { formState, handleSubmit, register } = useForm({
        resolver: yupResolver(newMeasurerFormSchema)
    });
    const { errors } = formState;
    const newMeasurerData = useMutation(async (formData: NewMeasurerFormData) => {
        try {
            const newMeasure: MeasurerData = {
                number: formData.number,
                title: formData.title,
                installationAddress: formData.installationAddress,
                email: [formData.email],
            };
            const response = await api.post('measurer', {
                ...newMeasure,
                createdAt: new Date(),
            });

            if (formData.password && formData.password_confirmation) {
                const newUser: UserData = {
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                }

                const responseUser = await api.post('users', {
                    ...newUser,
                    createdAt: new Date(),
                })
            }
            console.log('terminou useMutation');

            return formData;
        } catch (error) {
            console.log('catch', error);
        }
    }, {
        onSuccess: () => {
            console.log('onSuccess');
            //queryClient.invalidateQueries('measurers');
        }
    })

    const handleNewMeasurer: SubmitHandler<NewMeasurerFormData> = async (values) => {
        await newMeasurerData.mutateAsync(values);
        console.log('Após mutateAsync');
        if (newMeasurerData.isSuccess) {
            router.push('/');
        } else {
            toast({ title: 'Erro', description: 'Erro ao inserir usuário!', position: 'top' });
        }
    }

    return (
        <Box>
            <Header />
            <Flex w="100%" my="6" maxW={1480} mx="auto" px={["4","6"]}>
                <Box as="form" flex="1" borderRadius={8} bg="gray.800" p={["4","8"]} onSubmit={handleSubmit(handleNewMeasurer)}>
                    <Heading size="lg" fontWeight="normal">Criar relógio medidor</Heading>
                    <Divider my="6" borderColor="gray.700" />
                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="title" label="Titulo do medidor" error={errors.title} {...register('title')} />
                            <Input name="number" label="Número do medidor" error={errors.number} {...register('number')}/>
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="installationAddress" label="Endereço do medidor" error={errors.installationAddress} {...register('installationAddress')} />
                        </SimpleGrid>
                        <SimpleGrid minChildWidth="240px" spacing={["4","8"]} w="100%">
                            <Input name="email" type="email" label="E-mail" error={errors.email} {...register('email')} />
                            <Input name="name" label="Nome completo" error={errors.name} {...register('name')}/>
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