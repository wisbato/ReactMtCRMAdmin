import axios from "axios";

interface Creator {
  id: number;
  name: string;
  email: string;
}

interface InternalTransfer {
  id: number;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  createdBy: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  // Note: No 'updatedBy' field exists in the response
}

interface GetInternalResponse {
  transfers: InternalTransfer[];
}

export async function getInternal(): Promise<GetInternalResponse> {
  try {
    console.log("Fetching internal transfer report...");
    const response = await axios.get<GetInternalResponse>("/api/v1/itransfer", {
      withCredentials: true
    });
    
    console.log("Internal transfer data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching internal transfer report:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch internal transfer report");
  }
}