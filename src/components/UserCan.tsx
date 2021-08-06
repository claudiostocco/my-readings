import { ReactNode } from "react";
import { useCan } from "../services/hooks/useCan";

interface UserCanProps {
    permissions?: string[];
    children: ReactNode;
}

export function UserCan({ permissions, children }: UserCanProps) {
    const userCanSeeComponent = useCan({ permissions });
    if (!userCanSeeComponent) {
        return null;
    }
    return (
        <>
            {children}
        </>
    )
}