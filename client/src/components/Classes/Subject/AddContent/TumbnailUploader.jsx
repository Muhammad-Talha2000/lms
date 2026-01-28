import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const ThumbnailUploader = ({ setThumbnailFile }) => {
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setThumbnailFile(acceptedFiles[0]);
        setPreview(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    accept: "image/*",
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Thumbnail
      </label>
      <div
        {...getRootProps()}
        className={`mt-1 flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer transition-colors 
        ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img
            src={preview}
            alt="Thumbnail Preview"
            className="h-16 w-16 object-cover rounded-md"
          />
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the file here...</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop an image here, or click to select one
          </p>
        )}
      </div>
    </div>
  );
};

export default ThumbnailUploader;
