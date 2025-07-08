import axios from "axios";

interface UserInfo {
  name: string;
  email: string;
}

interface LoginActivity {
  id: number;
  userId: number;
  email: string;
  status: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
  User: UserInfo;
}

export async function getUserLoginActivity(userId: number): Promise<LoginActivity[]> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Fetching login activities for user ${userId}...`);
    
    const response = await axios.get(`/api/v1/login-logs/login-logs?userId=${userId}`, {
      withCredentials: true // Include if authentication is needed
    });
    
    console.log("Login activities response:", response.data);
    
    return response.data;

  } catch (error: any) {
    console.error("Error fetching login activities:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch login activities");
  }
}