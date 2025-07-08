import axios from "axios";

export interface NewsItem {
    id: number;
    Title: string;
    Description: string;
    Short_description: string;
    Image: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface GetNewsResponse {
  message: string;
  data: NewsItem[];
}

export async function getNews(): Promise<GetNewsResponse> {
  try {
    const response = await axios.get("/api/v1/news/getAllNews", {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching news:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to fetch news"
    );
  }
}