import axios from "axios";

export interface EdituserCredentials {
  id: number;
  name: string;
  email: string;
  password?: string;
  country: string;
  phone: string;
  status: string;
}

// Updated interface to match the actual API response
interface EditUserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  role: string;
  status: string;
  wallet_balance: string;
  lb_name: string | null;
  isIB: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function updateUser(
  userDetails: EdituserCredentials
): Promise<EditUserResponse> {
  try {
    const response = await axios.put(
      `/api/v1/user/users/${userDetails.id}`,
      userDetails,
      {
        withCredentials: true
      }
    );

    // The API returns the user object directly, not wrapped in a user property
    return response.data;
  } catch (error: any) {
    console.error("Error during edit user:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Edit user failed");
  }
}