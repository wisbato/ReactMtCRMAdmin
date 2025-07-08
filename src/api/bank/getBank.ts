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
  account_type: "savings" | "current";
  account_number: string;
  ifsc_swift_code: string | null;
  iban_number: string | null;
  bank_name: string;
  bank_address: string | null;
  country: string | null;
  passbook_file: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  User: User;
}

interface GetBankResponse {
  message: string;
  data: BankDetail[]; // Changed from bankDetails to data to match the actual response
}

export async function getBank(): Promise<GetBankResponse> {
  try {
    console.log("Fetching bank details...");
    const response = await axios.get<GetBankResponse>("/api/v1/bankdetails/getAllUsersBankDetails", {
      withCredentials: true // Only include if needed
    });
    
    console.log(response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching bank details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch bank details");
  }
}