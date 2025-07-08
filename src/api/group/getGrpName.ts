import axios from "axios";

export interface GroupName {
    id: number;
    groupName: string;
}

interface GetGroupsNameResponse {
  count: number;
  data: GroupName[];
}

export async function getGroupName(): Promise<GetGroupsNameResponse> {
  try {
    const response = await axios.get("/api/v1/MT5group", {
      withCredentials: true
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching groups name:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch groups name"
    );
  }
}