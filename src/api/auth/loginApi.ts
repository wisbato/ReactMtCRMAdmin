import axios from "axios";
import { connectSocket } from "../../utils/socket";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    country?: string | null;
    balance: string;
    permissiontype: string;
    menuPermissions: string[]; // ✅ Updated to match API response
    groupPermissions: string[]; // ✅ Updated to match API response
  };
  token: string;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await axios.post("/api/v1/auth/login", credentials, {
      withCredentials: true
    });
    
    console.log("Login API Response:", response.data);
    
    // Store both token and user data in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    connectSocket();
    return response.data;
  } catch (error: any) {
    console.error("Error during login:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
}