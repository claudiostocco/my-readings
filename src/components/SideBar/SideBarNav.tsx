import { Stack } from "@chakra-ui/react";
import { RiContactsBookUploadLine, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine } from "react-icons/ri";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
    return (
        <Stack spacing="12" align="flex-start">
            <NavSection title="GERAL">
                <NavLink href="/dashboard" icon={RiDashboardLine}>Dashboard</NavLink>
                <NavLink href="/users" icon={RiContactsLine}>Usuários</NavLink>
                <NavLink href="/readings" icon={RiContactsBookUploadLine}>Leituras</NavLink>
            </NavSection>
            <NavSection title="RELATÓRIOS">
                <NavLink href="/forms" icon={RiInputMethodLine}>Formulários</NavLink>
                <NavLink href="/automation" icon={RiGitMergeLine}>Automação</NavLink>
            </NavSection>
        </Stack>

    )
}