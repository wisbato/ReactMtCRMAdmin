import axios from "axios";

interface DeleteNewsCredentials {
  id: number;
}

interface DeleteNewsResponse {
  message: string;
}

export async function deleteNews(
  newsDetails: DeleteNewsCredentials
): Promise<DeleteNewsResponse> {
  try {
    
    const response = await axios.delete(`/api/v1/news/${newsDetails.id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Error during news deletion:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "News deletion failed");
  }
}