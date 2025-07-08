import axios from "axios";

export interface MT5AccountResponse {
  accountId: number;
  status?: string;
  message?: string;
  group?: string;
  country?: string;
  currency?: string;
  platform?: number;
  type?: number;
  balance: number;
  leverage: number;
  credit?: number;
  equity?: number;
  margin?: number;
  marginlevel?: number;
  freemargin?: number;
  closepnl?: number;
  openpnl?: number;
  name?: string;
  phone?: string;
  email?: string;
  // Additional fields from your model if needed
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

interface GetAllMT5Response {
  success: boolean;
  accounts: MT5AccountResponse[];
  message?: string;
}

export async function getallMT5Users(): Promise<GetAllMT5Response> {
  try {
    console.log("Fetching MT5 accounts...");
    const response = await axios.get<GetAllMT5Response>(
      "/api/v1/MT5Account/getAllMt5AccountInfos",
      {
        withCredentials: true // Only include if needed
      }
    );

    // Transform the data if needed to match your frontend expectations
    const transformedAccounts = response.data.accounts.map(account => ({
      ...account,
      // Add any transformations here if field names don't match
      accountid: account.accountId, // Example transformation
    }));

    console.log("MT5 accounts fetched successfully:", transformedAccounts);
    return {
      success: true,
      accounts: transformedAccounts,
      message: "MT5 accounts fetched successfully"
    };

  } catch (error: any) {
    console.error("Error fetching MT5 accounts:", error.response?.data || error.message);
    return {
      success: false,
      accounts: [],
      message: error.response?.data?.message || "Failed to fetch MT5 accounts"
    };
  }
}