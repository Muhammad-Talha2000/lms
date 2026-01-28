import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlogModal = ({ blog, onClose, onEdit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    tags: [],
    tagInput: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog?.title,
        description: blog?.description,
        thumbnail: blog?.thumbnail,
        tags: blog?.tags || [],
        tagInput: "",
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, description: value });
    if (errors.description) setErrors({ ...errors, description: "" });
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
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim() || formData.description === "<p><br></p>")
      newErrors.description = "Content is required";
    if (!formData.thumbnail.trim())
      newErrors.thumbnail = "Thumbnail URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const blogPayload = {
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        tags: formData.tags,
      };
      onEdit(blogPayload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-6">Edit Blog</h2>

        {/* TITLE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Blog Title"
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* THUMBNAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Thumbnail URL
          </label>
          <input
            name="thumbnail"
            type="text"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
            className={`w-full p-2 border rounded ${
              errors.thumbnail ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isSubmitting}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
          )}
        </div>

        {/* TAGS */}
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
                  className="text-red-500 ml-1"
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
            value={formData.tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            placeholder="Type tag and press Enter"
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isSubmitting}
          />
        </div>

        {/* DESCRIPTION */}
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
              readOnly={isSubmitting}
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
