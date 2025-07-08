import axios from "axios";

interface BankDetailsCredentials {
  userId: number;
  account_name: string;
  account_type: string;
  account_number: string;
  ifsc_swift_code: string;
  iban_number: string;
  bank_name: string;
  bank_address: string;
  country: string;
  passbook_file?: string; // Optional since it comes from file upload
}

interface BankDetail {
  id: number;
  userId: number;
  account_name: string;
  account_type: string;
  account_number: string;
  ifsc_swift_code: string;
  iban_number: string;
  bank_name: string;
  bank_address: string;
  country: string;
  passbook_file: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AddBankDetailResponse {
  message: string;
  data: BankDetail;
}

export async function addBankDetail(
  bankDetails: BankDetailsCredentials,
  file?: File
): Promise<AddBankDetailResponse> {
  try {
    const formData = new FormData();
    
    // Append all bank details to formData
    Object.entries(bankDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value)); // Convert to string safely
        }
      });
      
    
    // Append file if exists
    if (file) {
      formData.append('passbook_file', file);
    }

    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

    const response = await axios.post('/api/v1/bankdetails/addFromAdmin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during adding bank details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add bank details");
  }
}