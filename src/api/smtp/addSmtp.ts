// api/smtp.ts
import axios from "axios";

export interface SmtpSettingsInput {
    host: string;
    port: number;
    user: string;
    password: string;
}

export interface SmtpSettings extends SmtpSettingsInput {
    id: number;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
  message: string;
  smtp: SmtpSettings;
}

export async function addSmtp(settings: SmtpSettingsInput): Promise<ApiResponse> {
  try {
    const response = await axios.post("/api/v1/smtp", settings, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("SMTP creation error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      "Failed to create SMTP settings"
    );
  }
}