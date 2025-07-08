import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface BankDetail {
  id: number;
  userId: number;
  account_name: string;
  account_type: "savings" | "current" | string; // Made more flexible
  account_number: string;
  ifsc_swift_code: string;
  iban_number: string;
  bank_name: string;
  bank_address: string;
  country: string;
  passbook_file: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  User: User;
}

interface GetBankResponse {
  message: string;
  data: BankDetail[];
}

export async function getBankDetails(userId: number): Promise<GetBankResponse> {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log(`Fetching bank details for user ${userId}...`);
    
    const response = await axios.get<GetBankResponse>(
      `/api/v1/bankdetails/getAllBankDetails?userId=${userId}`,
      {
        withCredentials: true // Include if authentication is needed
      }
    );
    
    console.log("Bank details response:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching bank details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch bank details");
  }
}