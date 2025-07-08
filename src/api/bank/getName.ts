import axios from "axios";

interface nameResponse {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
  };
}

export async function getName(): Promise<nameResponse> {
  try {
    const response = await axios.get("/api/v1/user/users/names-emails", {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error during name fetch:",
      error.response?.data || error.message
    );

    throw new Error(error.response?.data?.message || "fetch name failed");
  }
}
