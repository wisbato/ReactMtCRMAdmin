import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
const PublicRoutes = () => {
  const { isAuthenticated, user } = useAuth();
 
  if (isAuthenticated === null) return <p>Loading...</p>;
 
  if (isAuthenticated) {
    if (user?.role === "admin") return <Navigate to="/dashboard" replace />;
  }
 
  return <Outlet />;
};
 
export default PublicRoutes;