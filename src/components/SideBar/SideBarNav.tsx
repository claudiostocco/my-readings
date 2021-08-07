import { Stack } from "@chakra-ui/react";
import { useContext } from "react";
import {
    RiContactsBookUploadLine,
    RiContactsLine,
    RiDashboardLine,
    RiGitMergeLine,
    RiInputMethodLine,
    RiLogoutCircleLine
} from "react-icons/ri";

import { AuthContext } from "@/src/contexts/AuthContext";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
    const { signOut } = useContext(AuthContext);

    return (
        <Stack spacing="12" align="flex-start">
            <NavSection title="GERAL">
                <NavLink href="/dashboard" icon={RiDashboardLine}>Dashboard</NavLink>
            </NavSection>
            <NavSection title="CADASTROS">
                <NavLink href="/users" icon={RiContactsLine}>Usuários</NavLink>
                <NavLink href="/measurers" icon={RiContactsLine}>Medidores</NavLink>
                <NavLink href="/readings" icon={RiContactsBookUploadLine}>Leituras</NavLink>
            </NavSection>
            <NavSection title="RELATÓRIOS">
                <NavLink href="/forms" icon={RiInputMethodLine}>Medidores</NavLink>
                <NavLink href="/automation" icon={RiGitMergeLine}>Leituras</NavLink>
            </NavSection>
            <NavSection title="">
                <NavLink href="#" onClick={signOut} icon={RiLogoutCircleLine}>Logout</NavLink>
                {/* <button onClick={signOut}>Logout</button> */}
            </NavSection>
        </Stack>

    )
}