import axios from "axios";

interface Creator {
  id: number;
  name: string;
  email: string;
}

interface UserWithdrawal {
  id: number;
  accountId: string;
  amount: number;
  type: string | null;
  bankAccount: string | null;
  note: string | null;
  comment: string | null;
  createdBy: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
}

export interface GetUserWithdrawalResponse {
  withdrawals: UserWithdrawal[];
}

export async function getWithdrawalDetail(userId: number): Promise<GetUserWithdrawalResponse> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Fetching withdrawals for user ${userId}...`);
    
    const response = await axios.get<GetUserWithdrawalResponse>(
      `/api/v1/withdrawal/${userId}`,
      {
        withCredentials: true // Include if authentication is needed
      }
    );
    
    console.log("Withdrawals response:", response.data);
    return response.data;

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching withdrawals:", errorMessage);
    throw new Error(errorMessage || "Failed to fetch withdrawals");
  }
}