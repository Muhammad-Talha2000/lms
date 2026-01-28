import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogModal = ({ onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    thumbnail: "",
    tagInput: "", // local tag input
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, description: value });
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  };

  const handleTagInput = (e) => {
    setFormData({ ...formData, tagInput: e.target.value });
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && formData.tagInput.trim()) {
      e.preventDefault();
      const newTag = formData.tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
          tagInput: "",
        });
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (
      !formData.description.trim() ||
      formData.description === "<p><br></p>"
    ) {
      newErrors.description = "Content is required";
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = "Thumbnail URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const blog = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        tags: formData.tags,
      };
      onSubmit(blog);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative custom-scrollbar">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-6">Create New Blog</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            type="text"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Thumbnail URL
          </label>
          <input
            name="thumbnail"
            type="text"
            placeholder="Enter image URL for blog thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.thumbnail ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
          )}
        </div>

        {/* Tags Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-1"
                  onClick={() => removeTag(tag)}
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type tag and press Enter"
            value={formData.tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or comma to add a tag
          </p>
        </div>

        {/* Description / Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          <div
            className={`${
              errors.description ? "border border-red-500 rounded" : ""
            }`}
          >
            <ReactQuill
              value={formData.description}
              onChange={handleContentChange}
              className="bg-white"
              readOnly={isSubmitting}
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
