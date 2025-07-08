import axios from "axios";

export interface EditnewsCredentials {
    id: number;
    Title: string;
    Description: string;
    Short_description: string;
    status: string;
    Image?: File;
}

interface EditNewsResponse {
    message: string;
    data: {
      id: number;
      Title: string;
      Description: string;
      Short_description: string;
      Image: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
}

export async function updateNews(
  newsDetails: EditnewsCredentials
): Promise<EditNewsResponse> {
  try {
    const formData = new FormData();
    formData.append('Title', newsDetails.Title);
    formData.append('Description', newsDetails.Description);
    formData.append('Short_description', newsDetails.Short_description);
    formData.append('status', newsDetails.status);
    if (newsDetails.Image) {
      formData.append('Image', newsDetails.Image);
    }

    const response = await axios.put(
      `/api/v1/news/${newsDetails.id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error during edit news:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Edit news failed"
    );
  }
}