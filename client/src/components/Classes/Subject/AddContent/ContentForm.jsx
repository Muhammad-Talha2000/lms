import React, { useState, useCallback } from "react";
import axios from "axios";
import { uploadFileToCloudinary } from "@/services/cloudinaryService";
import { useToast } from "@/hooks/use-toast";

const ContentForm = ({ formData, setFormData }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file validation
  const validateFile = (file) => {
    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file drop or selection
  const handleFileChange = useCallback(
    async (file) => {
      if (!file) return;

      if (!validateFile(file)) return;

      setSelectedFile(file);
      setDragActive(false);
      setUploading(true);

      try {
        // Upload to Cloudinary
        const url = await uploadFileToCloudinary(file);

        // Update form data with file URL
        setFormData((prev) => ({
          ...prev,
          url: url,
          fileName: file.name,
        }));

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded`,
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload file",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [setFormData, toast]
  );

  // Handle drop event
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFileChange(e.target.files[0]);
      }
    },
    [handleFileChange]
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Book or content Name"
        required
        value={formData?.name}
        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-orange-500 bg-orange-50"
            : selectedFile
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="pdf-upload"
          className="hidden"
          accept="application/pdf"
          onChange={handleInputChange}
          required
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-6 w-6 text-blue-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Uploading...</span>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm text-gray-600 break-all">
              {selectedFile.name}
            </p>
            <button
              onClick={() => {
                setSelectedFile(null);
                setFormData((prev) => ({ ...prev, url: "", fileName: "" }));
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            className="space-y-2 cursor-pointer"
            onClick={() => document.getElementById("pdf-upload").click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-xs text-gray-500">(PDF files only, max 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentForm;
