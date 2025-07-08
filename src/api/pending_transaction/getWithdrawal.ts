import axios from "axios";

interface UserWithdrawal {
    id: number;
    accountId: string;
    amount: number;
    type: string | null;  // Updated to match response (can be null)
    bankAccount: string | null;  // Updated to match response (can be null)
    note: string | null;
    comment: string | null;
    createdBy: number;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    creator: Creator;
  }
  
  interface Creator {
    id: number;
    name: string;
    email: string;
  }
  
  export interface GetUserWithdrawalResponse {
      withdrawals: UserWithdrawal[];
  }

export async function getWithdrawal(): Promise<GetUserWithdrawalResponse> {
  try {
    console.log("Fetching user withdrawals...");
    const response = await axios.get<GetUserWithdrawalResponse>("/api/v1/withdrawal?status=pending", {
      withCredentials: true // Only include if needed
    });
    
    console.log("Withdrawal data:", response.data);
    return response.data;

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching user withdrawals:", errorMessage);
    throw new Error(errorMessage || "Failed to fetch user withdrawals");
  }
}