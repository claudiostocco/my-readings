import { Stack } from "@chakra-ui/react";
import { RiContactsBookUploadLine, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
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
        </Stack>

    )
}