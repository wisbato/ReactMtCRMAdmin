import axios from "axios";

export interface GroupPermission {
  id: number;
  groupName: string;
}

export interface Subadmin {
  id: number;
  name: string;
  email: string;
  password: string;
  permissiontype: string;
  createdAt: string;
  groupPermissions: GroupPermission[];
}

export interface SubadminsResponse {
  message: string;
  data: Subadmin[];  // Changed from 'subadmins' to 'data' to match the response
}

export async function getSubadmin(): Promise<SubadminsResponse> {
  try {
    console.log("Fetching subadmins...");
    const response = await axios.get<SubadminsResponse>("/api/v1/subadmin", {
      withCredentials: true
    });
    
    console.log("Subadmins data:", response.data);
    return response.data;
    
  } catch (error: any) {
    console.error("Error fetching subadmins:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch subadmins");
  }
}