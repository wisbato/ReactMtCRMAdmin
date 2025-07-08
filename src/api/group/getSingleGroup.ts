// api/group/getSingleGroup.ts
import axios from "axios";

export interface SingleGroup {
  id: number;
  groupName: string;
  mt5GroupName: string;
  groupType: string;
  currencyUnit: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface GetSingleGroupResponse {
  message: string;
  group: SingleGroup;
}

export async function getSingleGroup(id: number): Promise<GetSingleGroupResponse> {
  try {
    const response = await axios.get(`/api/v1/groups/getAllGroups/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching single group:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch group details"
    );
  }
}