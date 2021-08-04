import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../contexts/AuthContext';
import { SideBarDrawerProvider } from '../contexts/SideBarDrawerContext';

import { theme } from '../styles/theme';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <SideBarDrawerProvider>
          <Component {...pageProps} />
        </SideBarDrawerProvider>
      </ChakraProvider>
    </AuthProvider>
  );
};

export default MyApp;
