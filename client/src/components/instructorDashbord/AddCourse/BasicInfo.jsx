import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BasicInfo = ({ formData, onChange }) => {
  // Handle rich-text editor change
  const handleDescriptionChange = (value) => {
    onChange({ field: "description", value }); // Update description field in the parent component's state
  };

  return (
    <div className="space-y-4">
      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Course Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full p-2 border rounded-md focus:outline-orange-500"
          placeholder="Enter course name"
          required
        />
      </div>

      {/* Course Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <ReactQuill
          value={formData.description}
          onChange={handleDescriptionChange}
          className="w-full bg-white"
          placeholder="Enter course description "
          required
        />
      </div>

      {/* Course Price */}
      <div>
        <label className="block text-sm font-medium mb-1">Price (RS.)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={onChange}
          className="w-full p-2 border rounded-md focus:outline-orange-500"
          placeholder="Enter course price"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfo;
