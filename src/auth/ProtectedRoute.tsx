import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children} : {children: React.ReactNode}) => {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return isAuthenticated ? <>{ children }</> : <Navigate to="/login" />;
}

export default ProtectedRoute;