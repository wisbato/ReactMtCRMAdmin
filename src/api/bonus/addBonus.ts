import axios from "axios";

export interface AddBonusCredentials {
  accountId: string;
  amount: number;
  type: 'IN' | 'OUT';
  currencyUnit: string;
  comment: string;
}

interface Bonus {
  id: number;
  userId: number;
  mt5AccountId: number;
  type: 'IN' | 'OUT';
  amount: string;
  createdBy: number;
  comment: string;
  updatedAt: string;
  createdAt: string;
}

interface AddBonusResponse {
  message: string;
  bonus: Bonus;
}

export async function addBonus(
  bonusDetails: AddBonusCredentials
): Promise<AddBonusResponse> {
  try {
    const response = await axios.post<AddBonusResponse>("/api/v1/bonus", bonusDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding bonus:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Failed to add bonus");
  }
}