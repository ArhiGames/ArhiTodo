import type { ReactNode } from "react";
import { useAuth } from "../../Contexts/useAuth.ts";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: { children: ReactNode }) => {

    const { isAuthenticated } = useAuth();

    return isAuthenticated()
        ? <>{props.children}</>
        : <Navigate to="/login" replace ></Navigate>;

}

export default ProtectedRoute;