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

interface Deposit {
  id: number;
  accountId: string;
  amount: number;
  type: string | null;
  transactionId: string | null;
  note: string | null;
  comment: string | null;
  depositProof: string | null;
  createdBy: number;
  createdFor: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  recipient: Recipient;
}

interface GetDepositResponse {
  deposits: Deposit[];
}

export async function getDeposit(): Promise<GetDepositResponse> {
  try {
    console.log("Fetching deposit report...");
    const response = await axios.get<GetDepositResponse>("/api/v1/deposit", {
      withCredentials: true
    });
    
    console.log("Deposit data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching deposit report:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch deposit report");
  }
}