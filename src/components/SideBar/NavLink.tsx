import { Icon, Link as ChakraLink, Text, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";

import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
    href: string
    icon: ElementType
    children: string
}

export function NavLink({ href, icon, children, ...rest}: NavLinkProps) {
    return (
        <ActiveLink href={href} passHref>
            <ChakraLink
                display="flex"
                align="center"
                minWidth={250}                
                lineHeight="2rem"
                _hover={{
                    bg: 'gray.700'
                }}
                {...rest}
            >
                <Icon as={icon} fontSize="20" height="2rem" />
                <Text ml="4"  fontWeight="medium">{children}</Text>
            </ChakraLink>
        </ActiveLink>
    );
}