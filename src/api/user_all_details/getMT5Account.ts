import axios from "axios";

export interface MT5Account {
  id: number;
  accountid: string;
  groupName: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  balance: number;
  mPassword: string;
  iPassword: string;
  leverage: number;
  createdBy: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: {
    id: number;
    name: string;
    email: string;
  };
}

interface GetMT5Response {
  message: string;
  accounts: MT5Account[];
}

export async function getMT5accounts(userId: number): Promise<GetMT5Response> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Fetching MT5 accounts for user ${userId}...`);
    
    const response = await axios.get<GetMT5Response>(
      `/api/v1/MT5Account/getMT5accounts?userId=${userId}`,
      {
        withCredentials: true
      }
    );
    
    console.log("MT5 accounts response:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching MT5 accounts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch MT5 accounts");
  }
}