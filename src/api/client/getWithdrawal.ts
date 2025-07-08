import axios from "axios";

interface Creator {
  id: number;
  name: string;
  email: string;
}

interface Recipient {
  id: number;
  name: string;
  email: string;
}

interface Withdrawal {
  id: number;
  accountId: string;
  amount: number;
  type: string | null;
  note: string | null;
  comment: string | null;
  bankAccount: string | null;
  withdrawProof?: string | null; // Optional as it's not in the response
  createdBy: number;
  createdFor: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  recipient: Recipient;
}

interface GetWithdrawResponse {
  withdrawals: Withdrawal[];
}

export async function getWithdrawal(): Promise<GetWithdrawResponse> {
  try {
    console.log("Fetching withdrawal report...");
    const response = await axios.get<GetWithdrawResponse>("/api/v1/withdrawal", {
      withCredentials: true
    });
    
    console.log("Withdraw data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching withdrawal report:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch withdrawal report");
  }
}