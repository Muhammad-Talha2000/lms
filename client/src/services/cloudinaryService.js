import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "lms-upload");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dyc7dpxdl/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "Failed to upload image"
    );
  }
};

export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resource_type", "raw");

  // let uploadPreset = "lms-docs";

  formData.append("upload_preset", "lms-docs");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dyc7dpxdl/raw/upload", // Generic endpoint for all types
      formData
    );
    console.log(response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error(
      "Cloudinary Upload Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "Failed to upload file"
    );
  }
};
