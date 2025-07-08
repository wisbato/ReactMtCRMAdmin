import axios from "axios";

interface Creator {
  id: number;
  name: string;
  email: string;
}

interface UserDeposit {
  id: number;
  accountId: string;
  amount: number;
  type: string;
  transactionId: string;
  note: string | null;
  comment: string | null;
  depositProof: string;
  createdBy: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
}

interface GetUserDepositResponse {
  deposits: UserDeposit[];
}

export async function getDepositDetail(userId: number): Promise<GetUserDepositResponse> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Fetching deposits for user ${userId}...`);
    
    const response = await axios.get<GetUserDepositResponse>(
      `/api/v1/deposit/${userId}`,  // Updated endpoint with path parameter
      {
        withCredentials: true
      }
    );
    
    console.log("Deposits response:", response.data);
    return response.data;

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching deposits:", errorMessage);
    throw new Error(errorMessage || "Failed to fetch deposits");
  }
}