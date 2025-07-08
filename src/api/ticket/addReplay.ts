import axios from "axios";

interface addReplayCredentials {
    message: string;
}

interface Replay {
    id: string;
    ticketId: number;
    senderId: number;
    senderRole: string;
    message: string;
    updatedAt: Date;
    createdAt: Date;
}

interface AddReplayResponse {
    message: string;
    data: Replay[] | Replay | any; // Made more flexible to handle different response structures
}

export async function addReplay(
    ticketId: number,
    replayDetails: addReplayCredentials
): Promise<AddReplayResponse> {
    try {
        console.log("Adding reply...");
        const response = await axios.post(
            `/api/v1/ticket/${ticketId}/messages`, // Fixed: Use template literal with actual ticketId
            replayDetails,
            {
                withCredentials: true // Only include if needed
            }
        );
        
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error adding reply:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to add reply");
    }
}