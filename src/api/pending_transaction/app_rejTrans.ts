import axios from "axios";

export interface DepositActionPayload {
  id: number;
  comment?: string; // Only needed for reject
}

interface DepositResponse {
  message: string;
  deposit: {
    id: number;
    accountId: string;
    amount: number;
    type: string;
    transactionId: string | null;
    note: string | null;
    comment: string | null;
    depositProof: string;
    createdBy: number;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function approveDeposit(id: number): Promise<DepositResponse> {
  try {
    const response = await axios.put(
      `/api/v1/deposit/${id}/approve`,
      {}, // Empty body for approval
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Approve Deposit Error:", {
      id,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || "Failed to approve deposit");
  }
}

export async function rejectDeposit(id: number, reason: string): Promise<DepositResponse> {
  try {
    const response = await axios.put(
      `/api/v1/deposit/${id}/reject`,
      { reason }, // Reason in the request body
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Reject Deposit Error:", {
      id,
      reason,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || "Failed to reject deposit");
  }
}