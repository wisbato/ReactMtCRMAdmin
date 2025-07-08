import axios from "axios";

interface Creator {
  id: number;
  name: string;
  email: string;
}

interface WalletTransaction {
  id: number;
  userId: number;
  mt5AccountId: string;
  to: string;
  amount: number;
  note: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
}

interface GetWalletResponse {
  transactions: WalletTransaction[];
}

export async function getWallet(): Promise<GetWalletResponse> {
  try {
    console.log("Fetching wallet transaction report...");
    const response = await axios.get<GetWalletResponse>("/api/v1/wallet", {
      withCredentials: true
    });
    
    console.log("Wallet transaction data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching wallet transaction report:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch wallet transaction report");
  }
}