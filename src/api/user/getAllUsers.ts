import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  wallet_balance: string;
  isIB: boolean;
  country: string;
  phone: string;
  lb_name: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  message: string;
  users: User[]; // Assuming API returns array
}

  export async function getAllUsers(): Promise<GetUsersResponse> {
    try {
      console.log("Fetching users...");
      const response = await axios.get("/api/v1/user/users", {
        withCredentials: true // Only include if needed
      });
      
      console.log(response.data);
      return response.data;

    } catch (error: any) {
      console.error("Error fetching users:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  }
