import axios from "axios";

export interface AddLeverageCredentials {
    accountId: number;
    leverage: number;
}

interface LeverageUpdateResponse {
    message: string;
}

export async function updateLeverage(
  leverageDetails: AddLeverageCredentials
): Promise<LeverageUpdateResponse> {
  try {
    const response = await axios.post(
      "/api/v1/MT5Account/updatelvg", 
      leverageDetails, 
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data) {
      throw new Error("No data received in response");
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error during leverage update:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Leverage update failed");
    }
    console.error("Unexpected error during leverage update:", error);
    throw new Error("An unexpected error occurred");
  }
}