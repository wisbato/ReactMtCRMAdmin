import axios from "axios";

interface Promotion {
  id: number;
  type: "Text" | "Image";
  Image: string | null;
  description: string | null;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface GetPromotionResponse {
  message: string;
  count: number;
  data: Promotion[];
}

export async function getPromotion(): Promise<GetPromotionResponse> {
  try {
    console.log("Fetching promotions...");
    const response = await axios.get<GetPromotionResponse>("/api/v1/promotions", {
      withCredentials: true
    });
    
    console.log("Promotions data:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching promotions:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch promotions");
  }
}