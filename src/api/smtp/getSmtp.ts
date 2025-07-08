import axios from "axios";

export interface SmtpSettings {
    id: number;
    host: string;
    port: number;
    user: string;  // Note: This is 'user' in the response, not 'username'
    password: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetSmtpResponse {
  message?: string;  // Optional since your response doesn't show it
  smtp: SmtpSettings; // Can be single object or array
}

export async function getSmtp(): Promise<GetSmtpResponse> {
  try {
    const response = await axios.get("/api/v1/smtp", {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching SMTP settings:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch SMTP settings"
    );
  }
}