import axios from "axios";

export interface WithdrawalActionPayload {
  id: number;
  comment?: string; // Only needed for reject
}

interface WithdrawalResponse {
  message: string;
  withdrawal: {
    id: number;
    accountId: string;
    amount: number;
    type: string | null;  // Updated to match response (can be null)
    bankAccount: string | null;  // Updated to match response (can be null)
    note: string | null;
    comment: string | null;
    createdBy: number;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function approveWithdrawal(id: number): Promise<WithdrawalResponse> {
  try {
    const response = await axios.put(
      `/api/v1/withdrawal/${id}/approve`,
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
    console.error("Approve Withdrawal Error:", {
      id,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || "Failed to approve withdrawal");
  }
}

export async function rejectWithdrawal(id: number, reason: string): Promise<WithdrawalResponse> {
  try {
    const response = await axios.put(
      `/api/v1/withdrawal/${id}/reject`,
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
    console.error("Reject withdrawal Error:", {
      id,
      reason,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || "Failed to reject withdrawal");
  }
}