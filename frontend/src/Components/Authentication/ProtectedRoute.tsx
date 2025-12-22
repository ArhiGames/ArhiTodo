import type { ReactNode } from "react";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: { children: ReactNode }) => {

    const { isLoaded, isAuthenticated } = useAuth();

    if (!isLoaded) return null;

    return isAuthenticated()
        ? <>{props.children}</>
        : <Navigate to="/login" replace ></Navigate>;

}

export default ProtectedRoute;