import axios from "axios";

export interface AddDepositCredentials {
  accountId: string; // Changed from number to string to match your Deposit model
  amount: number;
  transactionId?: string; // Made optional to match model
  comment?: string; // Made optional to match model
  userId: number;
}

interface AddDepositResponse {
  deposits?: {
    id: number;
    accountId: string;
    amount: number;
    type: 'bank' | 'cash' | null;
    transactionId: string | null;
    note: string | null;
    comment: string | null;
    depositProof: string | null;
    createdBy: number;
    createdFor: number;
    role: 'admin' | 'user';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
  };
}

export async function addDeposit(
  depositDetails: AddDepositCredentials
): Promise<AddDepositResponse> {
  try {
    const response = await axios.post("/api/v1/deposit", depositDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during add deposit:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Deposit failed");
  }
}