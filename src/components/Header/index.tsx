import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { RiMenuLine } from 'react-icons/ri';
import { useSideBarDrawer } from '../../contexts/SideBarDrawerContext';

import { Logo } from './Logo';
import { NotificationsNav } from './NotificationsNav';
import { Profile } from './Profile';
import { SearchBox } from './SearchBox';

export function Header() {
    const isWideScreen = useBreakpointValue({
        base: false,
        lg: true
    })
    const { onOpen } = useSideBarDrawer();
    return (
        <Flex
            as="header"
            w="100%"
            maxW={1480}
            h="20"
            mx="auto"
            mt="4"
            px="6"
            align="center"
        >
            {!isWideScreen && (
                <IconButton
                    aria-label="Open navigation"
                    icon={<Icon as={RiMenuLine} />}
                    fontSize="24"
                    variant="unstyled"
                    mr="2"
                    onClick={onOpen}
                >
                </IconButton>
            )}
            <Logo />
            <SearchBox />
            <Flex
                align="center"
                mx="auto"
            >
                <NotificationsNav />
                <Profile showProfileData={isWideScreen}/>
            </Flex>
        </Flex>
    )
}