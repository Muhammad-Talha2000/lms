import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import UploadProgress from "../Course/UploadProgress";

const ThumbnailUpload = ({ onFileSelect, currentThumbnail }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentThumbnail);
  const [uploading, setUploading] = useState(false); // To track upload state
  const [error, setError] = useState(""); // To show any error messages

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file)); // Show immediate preview

      try {
        setUploading(true);
        setError(""); // Clear previous errors

        // Upload to Cloudinary and get the URL
        const uploadedUrl = await uploadImageToCloudinary(file);
        setPreview(uploadedUrl); // Update preview with the Cloudinary URL
        onFileSelect(uploadedUrl); // Pass the Cloudinary URL to parent component
      } catch (error) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setUploading(false); // Reset uploading state
      }
    } else {
      setError("Please select a valid image file.");
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded"
          />
          <button
            onClick={() => {
              setPreview(null);
              onFileSelect(null);
            }}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2">Drag and drop your thumbnail here or</p>
          <label className="mt-2 inline-block cursor-pointer text-orange-500 hover:text-orange-600">
            Browse
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
        </>
      )}

      {uploading && <UploadProgress />}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default ThumbnailUpload;
