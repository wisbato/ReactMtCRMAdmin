import axios from "axios";

export interface AddgroupCredentials {
  groupName: string;
  mt5GroupName: string;
  groupType: string;
  currencyUnit: string;
  status: string;
}
interface AddGroupResponse {
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

export async function addGroup(
  groupDetails: AddgroupCredentials
): Promise<AddGroupResponse> {
  try {
    const response = await axios.post("/api/v1/groups/addGroup", groupDetails, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during add group:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "add group failed");
  }
}
