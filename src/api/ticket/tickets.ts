import axios from "axios";

interface User {
  name: string;
}

interface Ticket {
    id: number;
    userId: number;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    title: string;
    description: string;
    status: 'Open' | 'Closed';
    createdAt: string;
    updatedAt: string;
    user: User;
  }


  
  interface GetTicketsResponse {
    message: string;
    data: Ticket[];
  }

  export async function getTickets(): Promise<GetTicketsResponse> {
    try {
      console.log("Fetching users...");
      const response = await axios.get("/api/v1/ticket/getTickets", {
        withCredentials: true // Only include if needed
      });
      
      console.log(response.data);
      return response.data;

    } catch (error: any) {
      console.error("Error fetching tickets:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch tickets");
    }
  }
