import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
 
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
 
  if (isAuthenticated === null) return <p>Loading...</p>; // While checking auth state
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
 
export default ProtectedRoute;