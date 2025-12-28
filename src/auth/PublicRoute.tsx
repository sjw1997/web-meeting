import { useAuth } from "./auth";

const PublicRoute = ({ children } : {children: React.ReactNode}) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading</div>;
  }

  return <>{children}</>;
};

export default PublicRoute;