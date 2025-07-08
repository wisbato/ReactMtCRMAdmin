import axios from "axios";

export interface SubadminCredentials {
  name: string;
  email: string;
  password: string;
  permissiontype: string;
  groupIds?: string[]; // Optional field for MT5GroupWise subadmins
}

export interface SubadminResponse {
  message: string;
  subadmin: {
    wallet_balance: string;
    isIB: boolean;
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    country: string | null;
    phone: string | null;
    lb_name: string | null;
    otp: string | null;
    otpExpiresAt: string | null;
    lastOtpSentAt: string | null;
  };
}

export async function addSubadmin(
  subadminDetails: SubadminCredentials
): Promise<SubadminResponse> {
  try {
    const response = await axios.post("/api/v1/subadmin", subadminDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during subadmin creation:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Subadmin creation failed");
  }
}