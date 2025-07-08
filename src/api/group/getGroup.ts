import axios from "axios";

export interface getGroup {
    id: number;
    groupName: string;
    mt5GroupName: string;
    groupType: string;
    currencyUnit: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface GetGroupResponse {
  message: string;
  groups: getGroup[];
}

export async function getGroup(): Promise<GetGroupResponse> {
  try {
    const response = await axios.get("/api/v1/groups/getAllGroups", {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching group:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch group"
    );
  }
}