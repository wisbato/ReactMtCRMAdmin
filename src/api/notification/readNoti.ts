// api/notification/getNoti.ts
import axios from "axios";

export interface ReadNotificationCredentials {
    id: number;
}

interface ReadNotificationResponse {
    message: string;
}

export async function markNotificationRead(
  readNotiDetails: ReadNotificationCredentials
): Promise<ReadNotificationResponse> {
  try {
    const { id } = readNotiDetails;
    
    const response = await axios.put(
      `/api/v1/notification/read/${id}`,
      {},
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
      console.error("Axios error during notification read:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Failed to mark notification as read");
    }
    console.error("Unexpected error during notification read:", error);
    throw new Error("An unexpected error occurred");
  }
}