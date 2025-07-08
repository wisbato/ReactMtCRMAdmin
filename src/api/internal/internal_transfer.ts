import axios from "axios";

interface InternalTransferCredentials {
  userId: number;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}
interface InternalTransferResponse {
  message: string;
  transfer: {
    id: number;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    createdBy: number;
    role: "admin" | "user";
    createdAt: string;
    updatedAt: string;
  };
  // Optional fields that might be included
  fromAccount?: {
    newBalance: number;
  };
  toAccount?: {
    newBalance: number;
  };
}

export async function addInternaltransfer(
  internaltransferDetails: InternalTransferCredentials
): Promise<InternalTransferResponse> {
  try {
    const response = await axios.post(
      "/api/v1/itransfer",
      internaltransferDetails,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during add internal transfer:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "add internal transfer failed"
    );
  }
}
