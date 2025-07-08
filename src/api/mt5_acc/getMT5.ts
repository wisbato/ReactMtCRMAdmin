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
  accounts: MT5Account[]; // Changed from users to accounts
}

export async function getMT5Users(): Promise<GetMT5Response> {
  try {
    console.log("Fetching MT5 accounts...");
    const response = await axios.get("/api/v1/MT5Account/getMT5accounts", {
      withCredentials: true // Only include if needed
    });
    
    console.log(response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching MT5 accounts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch MT5 accounts");
  }
}

export async function getMT5Userid(userId: number): Promise<MT5Account> {
  try {
    const response = await axios.get(`/api/v1/MT5Account/getMT5accounts/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching MT5 account:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch MT5 account");
  }
}