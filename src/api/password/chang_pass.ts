import axios from "axios";

export interface ChangePasswordCredentials {
    newPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export async function patchChangePassword(
  id: string,  // Added id parameter
  changepasswordDetails: ChangePasswordCredentials
): Promise<ChangePasswordResponse> {
  try {
    const response = await axios.patch(`/api/v1/user/${id}/password`, changepasswordDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during change password:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "Password change failed");
  }
}