import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { AuthProvider } from '../contexts/AuthContext';
import { SideBarDrawerProvider } from '../contexts/SideBarDrawerContext';
import { queryClient } from '../services/queryClient';

import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SideBarDrawerProvider>
            <Component {...pageProps} />
          </SideBarDrawerProvider>
        </ChakraProvider>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
