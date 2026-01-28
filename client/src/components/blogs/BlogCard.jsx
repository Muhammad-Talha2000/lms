import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, thumbnail, tags, createdAt } = blog;
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-xl shadow-md p-4 mb-4 flex gap-4 bg-white hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/blogs/${blog._id}`)}
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="w-32 h-32 object-cover rounded-lg"
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-700">
          {description.replace(/<[^>]+>/g, "").slice(0, 100)}...
        </p>
        <div className="text-sm text-gray-500 mt-1">
          {new Date(createdAt).toLocaleDateString()}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
