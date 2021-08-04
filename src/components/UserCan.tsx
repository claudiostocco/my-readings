import { ReactNode } from "react";
import { useCan } from "../services/hooks/useCan";

interface UserCanProps {
    permissions?: string[];
    roles?: string[];
    children: ReactNode;
}

export function UserCan({ permissions, roles, children}: UserCanProps) {
    const userCanSeeComponent = useCan({ permissions, roles });
    if (!userCanSeeComponent) {
        return null;
    }
    return (
        <>
            {children}
        </>
    )
}