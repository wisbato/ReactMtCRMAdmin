import axios from "axios";

export interface App_RejectUserCredentials {
  userId: number;
  type: string;
  comment: string;
  status: string;
}

// Updated interface to match the actual API response
interface App_RejectUserResponse {
  message: string;
  data: string;
}

export async function app_rejUser(
  userDetails: App_RejectUserCredentials
): Promise<App_RejectUserResponse> {
  try {

    console.log('User  ID:', userDetails.userId);
    // Ensure the type is in the correct format for the API
    const validTypes = ['proof_of_identity', 'proof_of_address'];
    if (!validTypes.includes(userDetails.type)) {
      throw new Error(`Invalid frontend document type: ${userDetails.type}`);
    }
    // Prepare the exact payload the backend expects
    const payload = {
      userId: userDetails.userId,
      type: userDetails.type, // Use the type directly as it is valid
      status: userDetails.status,
      comment: userDetails.status === 'approved' ? null : (userDetails.comment || '')
    };
    console.log('Final API payload:', payload); // DEBUG
    const response = await axios.put(
      '/api/v1/document/updateStatus',
      payload,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error Details:", {
      request: userDetails,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || "Document update failed");
  }
}