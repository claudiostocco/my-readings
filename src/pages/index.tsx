import { Box, Button, Flex, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from "next/router";
import { useContext } from "react";

import { Input } from '../components/Form/Input';
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string
  password: string
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
  password: yup.string().required('Senha obrigatória!'),
})

export default function SignIn() {
  const { signIn, isAutenticated, messageError } = useContext(AuthContext);
  const router = useRouter();
  const toast = useToast();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });
  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    await signIn(values);
    if (!isAutenticated) {
      toast({
        title: 'Erro na autenticação',
        description: messageError ?? 'Erro na autenticação do usuário!',
        position: "top",
        isClosable: true,
      });
    }
  }

  const handleNewClock = () => {
    router.push('/newClock');
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="Center"
      justify="Center"
    >
      <Box>
        <Flex
          as="form"
          w="100%"
          maxW={360}
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="4">
            <Input name="email" type="email" label="E-mail" error={errors.email} {...register('email')} />
            <Input name="password" type="password" label="Senha" error={errors.password} {...register('password')} />
          </Stack>
          <Button
            type="submit"
            mt="6"
            colorScheme="pink"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </Flex>
        <Flex
          w="100%"
          maxW={360}
          bg="gray.800"
          mt="4"
          p="8"
          borderRadius={8}
          flexDir="column"
        >
          <Text>Se ainda não é cadastrado adicione um novo relógio.</Text>
          <Button
            type="button"
            mt="6"
            colorScheme="blue"
            size="lg"
            onClick={handleNewClock}
          >
            Novo relógio
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});