import type { ReactNode } from "react";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { Navigate } from "react-router-dom";
import type {Claim} from "../../Models/Claim.ts";

interface Props {
    children: ReactNode;
    requiredClaims?: Claim[];
}

const ProtectedRoute = (props: Props) => {

    const { isLoaded, jwtPayload, isAuthenticated } = useAuth();

    if (!isLoaded) return null;

    function fulfillsRequirements(): boolean {
        if (!jwtPayload) return false;
        if (!isAuthenticated()) return false;

        if (!props.requiredClaims) return true;
        for (const requiredClaim of props.requiredClaims) {
            const jwtValue = String(jwtPayload[requiredClaim.claimType as keyof typeof jwtPayload]);
            if (jwtValue === requiredClaim.claimValue) {
                return true;
            }
        }

        return false;
    }

    return fulfillsRequirements()
        ? props.children
        : <Navigate to="/login" replace></Navigate>;

}

export default ProtectedRoute;