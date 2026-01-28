import React, { useState } from "react";
import { useSelector } from "react-redux";
import DefaultLayout from "@/components/layout/DefaultLayout";
import FeaturedBlogs from "@/components/blogs/FeaturedBlogs";
import BlogModal from "@/components/blogs/BlogModal";
import { createBlog } from "@/services/blogServices";

const BlogsPage = () => {
  // Get authentication data from Redux store
  const { loggedinUser } = useSelector((state) => state.auth);
  const user = loggedinUser?.user || null;
  const isAdmin = user?.role === "admin";
  const token = loggedinUser?.token;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateBlog = async (blogData) => {
    try {
      setIsCreating(true);
      setError("");

      // Check if we have a token
      if (!token) {
        throw new Error("You must be logged in to create a blog");
      }

      console.log("Token being used:", token);

      await createBlog(blogData, token);
      setIsModalOpen(false);
      setRefresh((prev) => !prev); // Trigger blog list reload
    } catch (err) {
      console.error("Error creating blog:", err);
      setError(err.message || "Failed to create blog. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blogs</h1>

        {/* Show create button only if the user is an admin */}
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              onClick={() => setIsModalOpen(true)}
            >
              Create New Blog
            </button>
          </div>
        )}

        {/* Error alert if blog creation fails */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Featured blogs component that will show all blogs */}
        <FeaturedBlogs refresh={refresh} />

        {/* Blog creation modal */}
        {isModalOpen && (
          <BlogModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateBlog}
            isSubmitting={isCreating}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default BlogsPage;
