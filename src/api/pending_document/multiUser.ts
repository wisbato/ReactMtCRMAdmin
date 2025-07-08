import axios from "axios";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Document {
  file_url: string;
  status: string;
  comment: string;
  uploaded: boolean;
}

interface Documents {
  proof_of_address?: Document;
  proof_of_identity?: Document;
  // Add other possible document types here if needed
}

interface UserDocument {
  id: number;
  userId: number;
  user: User;
  documents: Documents;
  createdAt: string;
  updatedAt: string;
}

interface GetUserDocumentsResponse {
  message: string;
  data: UserDocument[];
}

export async function getMultiUserDocuments(): Promise<GetUserDocumentsResponse> {
  try {
    console.log("Fetching user documents...");
    const response = await axios.get("/api/v1/document/getAllDocument", {
      withCredentials: true // Only include if needed
    });
    
    console.log(response.data);
    return response.data;

  } catch (error: any) {
    console.error("Error fetching user documents:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user documents");
  }
}