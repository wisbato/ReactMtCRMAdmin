import axios from "axios";

interface UserDeposit {
  id: number;
  accountId: string;
  amount: number;
  type: string;
  transactionId: string;
  note: string | null;  // Can be null based on response
  comment: string | null;  // Explicitly marked as nullable
  depositProof: string;
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

interface GetUserDepositResponse {
  deposits: UserDeposit[];
}

export async function getDeposit(): Promise<GetUserDepositResponse> {
  try {
    console.log("Fetching user deposits...");
    const response = await axios.get<GetUserDepositResponse>("/api/v1/deposit?status=pending", {
      withCredentials: true // Only include if needed
    });
    
    console.log("Deposit data:", response.data);
    return response.data;

  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching user deposits:", errorMessage);
    throw new Error(errorMessage || "Failed to fetch user deposits");
  }
}