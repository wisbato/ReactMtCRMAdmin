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

interface GetSingleNewsResponse {
  message: string;
  data: NewsItem;
}

export async function getSingleNews(
  newsDetails: { id: number }
): Promise<GetSingleNewsResponse> {
  try {
    const response = await axios.get(`/api/v1/news/${newsDetails.id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during fetching single news:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Fetching news failed"
    );
  }
}
