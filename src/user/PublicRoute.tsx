import { useAuth } from "./auth";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
    return <>{children}</>;
};

export default PublicRoute;