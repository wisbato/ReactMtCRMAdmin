import axios from "axios";

interface AddclientCredentials {
   accountId: string;
   amount: number;
   comment: string;
   userId: number;
}
interface WithdrawalResponse {
    message: string;
    withdrawal: {
      id: number;
      accountId: string;
      amount: number;
      type: 'bank' | 'cash' | null;
      comment: string | null;
      bankAccount: string | null;
      createdBy: number;
      role: 'admin' | 'user';
      createdAt: string;
      updatedAt: string;
    };
    // Optional fields that might be included
    account?: {
      newBalance: number;
    };
  }

export async function addClient(
  clientDetails: AddclientCredentials
): Promise<WithdrawalResponse> {
  try {
    const response = await axios.post("/api/v1/withdrawal", clientDetails,{
        withCredentials: true
    } );

    return response.data;
  } catch (error: any) {
    console.error("Error during add client:", error.response?.data || error.message);

    throw new Error(error.response?.data?.message || "add client failed");
  }
}
