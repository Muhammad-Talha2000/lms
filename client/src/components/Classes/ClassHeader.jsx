import React from "react";

const ClassHeader = ({ name, description }) => {
  return (
    <div className="border-b pb-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">{name}</h1>

      <div className="bg-orange-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Description</h2>
        <p className="text-gray-700">
          {description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default ClassHeader;
