import axios from "axios";

export interface EmailCredentials {
  sendTo: "ALL" | "SELECTED";
  selectedUserIds?: string[]; // Optional, only required when sendTo is "SELECTED"
  subject: string;
  body: string;
}

interface EmailResponse {
  message: string;
}

export async function addEmail(
  emailDetails: EmailCredentials
): Promise<EmailResponse> {
  try {
    // Validate that selectedUserIds is provided when sendTo is "SELECTED"
    if (emailDetails.sendTo === "SELECTED" && !emailDetails.selectedUserIds) {
      throw new Error("selectedUserIds is required when sendTo is SELECTED");
    }

    const response = await axios.post("/api/v1/email", emailDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during sending email:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Email sending failed");
  }
}