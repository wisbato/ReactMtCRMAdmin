import axios from "axios";

export interface AddMt5Credentials {
  userId: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  balance: number;
  leverage: number;
  groupName: string;
}

interface AddMT5Response {
  message: string;
  account: {
    accountid: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    balance: number;
    leverage: number;
    groupName: string;
    mPassword: string;
    iPassword: string;
    createdBy: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Update your addMT5.ts file with better error handling:

export async function createMT5Account(
    accountDetails: AddMt5Credentials
  ): Promise<AddMT5Response> {
    try {
      console.log("=== Sending MT5 Account Creation Request ===");
      console.log("URL:", "/api/v1/MT5Account/createAccount");
      console.log("Payload:", JSON.stringify(accountDetails, null, 2));
      
      const response = await axios.post(
        "/api/v1/MT5Account/createAccount", 
        accountDetails,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log("=== Success Response ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("=== MT5 Account Creation Error ===");
      console.error("Full error object:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
        
        // Try to get the specific error message from the server
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            error.response.statusText || 
                            `Server error: ${error.response.status}`;
        
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        throw new Error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        throw new Error(error.message || "Request failed");
      }
    }
  }