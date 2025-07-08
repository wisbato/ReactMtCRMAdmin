import axios from "axios";

interface DeleteuserCredentials {
  id: number;
}
interface DeleteUserResponse {
    message: string;
  }

export async function deleteUser(
  userDetails: DeleteuserCredentials
): Promise<DeleteUserResponse> {
  try {
    const response = await axios.delete(`/api/v1/user/users/${userDetails.id}`, {
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during delete user:", error.response?.data || error.message);

    throw new Error(error.response?.data?.message || "delete user failed");
  }
}
