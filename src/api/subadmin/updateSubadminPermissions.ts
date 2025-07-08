import axios from "axios";

export interface UpdateSubadminPermissions {
  userId: string;
  menuIds?: number[]; // Optional field for MenuWise permissions
  groupIds?: number[]; // Optional field for MT5GroupWise permissions
}

export interface SubadminPermissionsResponse {
  message: string;
}

export async function updateSubadminPermissions(
  permissionsData: UpdateSubadminPermissions
): Promise<SubadminPermissionsResponse> {
  try {
    const response = await axios.post( // Changed from PUT to POST
      "/api/v1/subadmin/permissions",
      permissionsData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating subadmin permissions:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to update subadmin permissions"
    );
  }
}