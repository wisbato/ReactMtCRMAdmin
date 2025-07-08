import axios from "axios";

interface Replay {
  id: string,
  ticketId: number,
  senderId: number,
  senderRole: string,
  message: string,
  updatedAt: Date,
  createdAt: Date
  }
  
  interface GetReplayResponse {
    message: string;
    data: Replay[] | Replay | any;
  }

  // Get Replies Function
export async function getReplay(ticketId: number): Promise<GetReplayResponse> {
  try {
      console.log("Fetching replies...");
      const response = await axios.get(`/api/v1/ticket/${ticketId}/messages`, {
          withCredentials: true
      });
      
      console.log(response.data);
      return response.data;
  } catch (error: any) {
      console.error("Error fetching replies:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch replies");
  }
}
