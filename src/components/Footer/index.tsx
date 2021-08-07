import { Flex, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { apiAuth } from '../../services/api';
import { useCan } from '../../services/hooks/useCan';
import { UserCan } from '../UserCan';

export function Footer() {
    const { signOut } = useContext(AuthContext);
    const [testMsg, setTestMsg] = useState('');
    const [version, setVersion] = useState('');

    // useEffect(() => {
    //     apiAuth.get('/test')
    //     .then(response => setTestMsg(response.data.test))
    //     .catch(error => console.log(error));

    //     apiAuth.get('/version')
    //     .then(response => setVersion(response.data.version))
    //     .catch(error => console.log(error));
    // },[]);

    return (
        <Flex
            as="footer"
            w="100%"
            maxW={1480}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
        >
            <UserCan permissions={[]} >
                <Text
                    align="center"
                    mx="auto"
                >
                    Versão: {version}
                </Text>
            </UserCan>

            <UserCan permissions={[]}>
                <Text
                    align="center"
                    mx="auto"
                >
                    Teste: {testMsg}
                </Text>
            </UserCan>

            {/* <button onClick={signOut}>Logout</button> */}
        </Flex>
    )
}