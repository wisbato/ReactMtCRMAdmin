import axios from "axios";

export interface AddwalletCredentials {
    accountId: string;
    to: string;
    amount: string;
    note: string;
    userId: string;
}

interface WalletTransactionResponse {
    id: number;
    userId: number;
    mt5AccountId: number;
    to: 'mt5' | 'wallet';
    amount: number;
    note: string | null;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
}

interface AddWalletResponse {
  message: string;
  transaction: WalletTransactionResponse;
}

export async function addWalletTransaction(
  walletDetails: AddwalletCredentials
): Promise<AddWalletResponse> {
  try {
    const response = await axios.post("/api/v1/wallet", walletDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during wallet transaction:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Wallet transaction failed");
  }
}