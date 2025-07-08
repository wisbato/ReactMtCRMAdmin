import axios from "axios";

interface UserDocumentData {
  userId: number;
  proof_of_address?: File;
  proof_of_identity?: File;
}

interface DocumentStatus {
  file_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded: boolean;
}

interface UserInfo {
  id: number;
  email: string;
  name: string;
}

interface UserDocuments {
  proof_of_address?: DocumentStatus;
  proof_of_identity?: DocumentStatus;
}

interface UserDocumentResponse {
  message: string;
  data: {
    id: number;
    userId: number;
    user: UserInfo;
    documents: UserDocuments;
    createdAt: string;
    updatedAt: string;
  };
}

export async function addUserDocumentFromAdmin(
  documentData: UserDocumentData
): Promise<UserDocumentResponse> {
  try {
    const formData = new FormData();
    formData.append('userId', documentData.userId.toString());
    
    if (documentData.proof_of_address) {
      formData.append('proof_of_address', documentData.proof_of_address);
    }
    
    if (documentData.proof_of_identity) {
      formData.append('proof_of_identity', documentData.proof_of_identity);
    }

    const response = await axios.post<UserDocumentResponse>("/api/v1/document/addFromAdmin", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during document upload:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Document upload failed");
  }
}