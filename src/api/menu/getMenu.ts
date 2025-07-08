import axios from "axios";

interface MenuItem {
  id: number;
  label: string;
}

interface MenuCategory {
  [key: string]: MenuItem[];
}

// api.ts
export async function getMenu(): Promise<MenuCategory> {  // Changed return type
    try {
      console.log("Fetching menu items...");
      const response = await axios.get<MenuCategory>("/api/v1/subadmin/getMenus", {
        withCredentials: true
      });
      
      console.log(response.data);
      return response.data;  // Return data directly, not response.data.data
  
    } catch (error: any) {
      console.error("Error fetching menu items:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch menu items");
    }
  }