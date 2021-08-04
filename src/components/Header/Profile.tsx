import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";

interface ProfileProps {
    showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
    const { isAutenticated, user } = useContext(AuthContext);
    return (
        <Flex align="center">
            {showProfileData && (
                <Box mr="4" textAlign="right">
                    <Text>{isAutenticated ? 'Claudio Marcio Stocco' : ''}</Text>
                    <Text color="gray.300" fontSize="small">
                        {isAutenticated ? user.email : ''}
                    </Text>
                </Box>
            )}
            <Avatar size="md" name="Claudio Marcio Stocco" src="https://avatars.githubusercontent.com/u/47143084?v=4" />
        </Flex>
    );
}