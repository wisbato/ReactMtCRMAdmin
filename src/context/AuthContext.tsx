import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

// Define User Type - Updated to match API response
interface User {
  id: number;
  role: string;
  email: string;
  name: string;
  phone?: string | null;
  country?: string | null;
  balance: string;
  permissiontype: string;
  menuPermissions: string[]; // ✅ Changed from menus to menuPermissions
  groupPermissions: string[]; // ✅ Added groupPermissions
}

// Define AuthContext Type
interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setUser: (user: User | null) => void;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Log when user context changes
  useEffect(() => {
    console.log("User context updated:", user);
    if (user) {
      console.log("User permissions:", user.menuPermissions);
      console.log("User groups:", user.groupPermissions);
    }
  }, [user]);

  // Fetch user authentication details when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to get user from localStorage first for faster loading
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("Loaded user from localStorage:", parsedUser);
        }
        
        // Then verify with backend
        const response = await axios.get("/api/v1/auth/check-auth", {
          withCredentials: true
        });
        
        setIsAuthenticated(true);
        setUser(response.data.user);
        
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        console.log("Authenticated user from server:", response.data.user);
      } catch (error) {
        console.log("Authentication check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
        // Clear localStorage on auth failure
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        setIsAuthenticated,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};