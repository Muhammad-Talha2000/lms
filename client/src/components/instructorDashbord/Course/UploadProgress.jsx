import React from "react";

const UploadProgress = () => {
  return (
    <div className="flex flex-col items-center p-4 space-y-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full animate-progress"
          style={{
            animation: "progress 1s ease-in-out infinite",
            width: "90%",
          }}
        />
      </div>
      <p className="text-sm text-gray-600">Uploading thumbnail...</p>
    </div>
  );
};

export default UploadProgress;
