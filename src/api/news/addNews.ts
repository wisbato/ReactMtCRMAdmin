// src/api/newsApi.ts
import axios from "axios";

export interface AddNewsCredentials {
  Title: string;
  Description: string;
  Short_description: string;
  status: string;
  Image?: File;
}

export interface AddNewsResponse {
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

export const addNews = async (newsDetails: AddNewsCredentials): Promise<AddNewsResponse> => {
    try {
        const formData = new FormData();
    console.log(newsDetails);
    formData.append('Title', newsDetails.Title);
    formData.append('Description', newsDetails.Description);
    formData.append('Short_description', newsDetails.Short_description);
    formData.append('status', newsDetails.status);
  
    if (newsDetails.Image instanceof File) {
      formData.append('Image', newsDetails.Image);
    } else {
      throw new Error("Image file is missing or invalid");
    }

    // Debug: Proper FormData logging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
    const response = await axios.post("/api/v1/news/addNews", formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  
    return response.data;
    } catch (error : any) {
        console.error("Error during add news:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "add news failed");
        
    }
  };
  