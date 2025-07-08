import axios from "axios";

interface AdduserCredentials {
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
}
interface AddUserResponse {
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      password: string;
      role: string;
      wallet_balance: string;
      isIB: boolean;
      country: string;
      phone: string;
      lb_name: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }

export async function addUser(
  userDetails: AdduserCredentials
): Promise<AddUserResponse> {
  try {
    const response = await axios.post("/api/v1/user/users", userDetails,{
        withCredentials: true
    } );

    return response.data;
  } catch (error: any) {
    console.error("Error during add user:", error.response?.data || error.message);

    throw new Error(error.response?.data?.message || "add user failed");
  }
}
