// api/notification/getNoti.ts (or wherever you have it)
import axios from "axios";

interface DeleteNotificationCredentials {
  id: number;
}

interface DeleteNotificationResponse {
  message: string;
}

export async function deleteNotification(
  deleteDetails: DeleteNotificationCredentials
): Promise<DeleteNotificationResponse> {
  try {
    const { id } = deleteDetails;
    
    const response = await axios.delete(
      `/api/v1/notification/delete/${id}`,
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
      console.error("Axios error during notification deletion:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Failed to delete notification");
    }
    console.error("Unexpected error during notification deletion:", error);
    throw new Error("An unexpected error occurred");
  }
}