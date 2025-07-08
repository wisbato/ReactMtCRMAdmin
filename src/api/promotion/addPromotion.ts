import axios from "axios";
import FormData from 'form-data';

interface AddPromotionCredentials {
  type: string;
  description?: string;  // Optional since it's not needed for Image type
  status: string;
  Image?: File;         // For file upload
}

interface AddPromotionResponse {
  message: string;
  data: {
    id: number;
    type: string;
    Image: string | null;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const addPromotion = async (
    promotionDetails: AddPromotionCredentials
  ): Promise<AddPromotionResponse> => {
    const formData = new FormData();
    
    formData.append('type', promotionDetails.type);
    formData.append('status', promotionDetails.status);
    
    if (promotionDetails.type === "Text" && promotionDetails.description) {
      formData.append('description', promotionDetails.description);
    }
    
    if (promotionDetails.type === "Image") {
      if (!promotionDetails.Image) {
        throw new Error("Image is required for Image type promotion");
      }
      // Ensure this field name matches exactly what your backend expects
      formData.append('Image', promotionDetails.Image);
    }
  
    try {
      const response = await axios.post("/api/v1/promotions/addPromotion", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Detailed error:", error);
      if (error.response) {
        // Forward the server's error message
        throw new Error(error.response.data.message || "Add promotion failed");
      }
      throw error;
    }
  };