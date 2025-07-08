import axios from "axios";

export interface EditMT5PasswordCredentials {
  accountId: number;
  mPassword?: string;
  iPassword?: string;
  passwordType: string; // Assuming this indicates which password to update (main/investor)
}

interface EditMT5PasswordResponse {
  message: string; // The API seems to return just a message
}

export async function updateMT5Password(
  mt5PasswordDetails: EditMT5PasswordCredentials
): Promise<EditMT5PasswordResponse> {
  try {
    const response = await axios.post(
      "/api/v1/MT5Account/updatePwd",
      mt5PasswordDetails,
      {
        withCredentials: true
      }
    );

    console.log(response.data);

    return response.data; // Assuming the response is { message: "Password updated successfully" }
  } catch (error: any) {
    console.error("Error during MT5 password update:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "MT5 password update failed");
  }
}