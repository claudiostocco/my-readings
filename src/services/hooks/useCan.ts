import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"

type useCanParams = {
    permissions?: string[];
}

export function useCan({ permissions }: useCanParams) {
    const { isAutenticated, user } = useContext(AuthContext);

    if (!isAutenticated) {
        return false;
    }

    if (permissions?.length > 0) {
        const hasAllPermissions = permissions.every(permission => {
            return user.permissions.includes(permission);
        });
        if (!hasAllPermissions) {
            return false;
        }
    }

    return true;
}