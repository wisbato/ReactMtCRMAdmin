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

interface Mt5Account {
  id: number;
  accountid: string;
  groupName: string;
}

interface BonusTransaction {
  id: number;
  userId: number;
  mt5AccountId: number;
  type: string;
  amount: string;
  createdBy: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  recipient: Recipient;
  creator: Creator;
  mt5Account: Mt5Account;
}

export interface GetBonusResponse {
  count: number;
  data: BonusTransaction[];
}

export async function getBonus(): Promise<GetBonusResponse> {
  try {
    console.log("Fetching bonus transactions...");
    const response = await axios.get<GetBonusResponse>("/api/v1/bonus", {
      withCredentials: true
    });
    
    console.log("Bonus data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching bonus transactions:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch bonus transactions");
  }
}