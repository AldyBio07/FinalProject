import axios from "axios";
import { getCookie } from "cookies-next";

export const uploadImage = async (file) => {
  if (!file) {
    console.error("No file selected for upload.");
    return null;
  }

  const api =
    "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image";
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = getCookie("token"); // Retrieve token directly within this helper

  const config = {
    headers: {
      apiKey: apiKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const formData = new FormData();
  formData.append("image", file); // Make sure the key name matches the API requirement

  try {
    const response = await axios.post(api, formData, config);
    console.log("Upload successful:", response.data);
    return response.data.url; // Adjust based on actual response structure
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};
