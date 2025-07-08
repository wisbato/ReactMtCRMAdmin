// api/ticket/deleteTicket.ts
import axios from "axios";

interface DeleteTicketCredentials {
  id: number;
}

interface DeleteTicketResponse {
  message: string;
}

export async function deleteTicket(
  ticketDetails: DeleteTicketCredentials
): Promise<DeleteTicketResponse> {
  try {
    
    const response = await axios.delete(`/api/v1/ticket/${ticketDetails.id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error during ticket deletion:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ticket deletion failed");
  }
}