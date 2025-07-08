import axios from "axios";

export interface EditgroupCredentials {
    id: number; // Added ID field
    groupName: string;
    mt5GroupName: string;
    groupType: string;
    currencyUnit: string;
    status: string;
}

interface EditGroupResponse {
    message: string;
    group: {
      id: number;
      groupName: string;
      mt5GroupName: string;
      groupType: string;
      currencyUnit: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
}

export async function updateGroup(
  groupDetails: EditgroupCredentials
): Promise<EditGroupResponse> {
  try {
    const { id, ...updateData } = groupDetails;
    
    const response = await axios.put(
      `/api/v1/groups/editGroup/${id}`, // Dynamic URL with actual ID
      updateData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data) {
      throw new Error("No data received in response");
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error during group update:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Group update failed");
    }
    console.error("Unexpected error during group update:", error);
    throw new Error("An unexpected error occurred");
  }
}