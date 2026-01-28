import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog, deleteBlog } from "@/services/blogServices";
import EditBlogModal from "@/components/blogs/EditBlogModal";
import { useSelector } from "react-redux";
import DefaultLayout from "@/components/layout/DefaultLayout";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedinUser } = useSelector((state) => state.auth);
  const user = loggedinUser?.user || null;
  const isAdmin = user?.role === "admin";
  const token = loggedinUser?.token;

  const [blogDetails, setBlogDetails] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBlogDetails = async () => {
    try {
      const data = await getBlogById(id);
      setBlogDetails(data);
    } catch (err) {
      console.error("Error fetching blog", err);
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      setIsSubmitting(true);
      await updateBlog(id, updatedData, token);
      setIsEditOpen(false);
      fetchBlogDetails();
    } catch (err) {
      console.error("Error updating blog", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id, token);
        navigate("/blogs");
      } catch (err) {
        console.error("Error deleting blog", err);
      }
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  if (!blogDetails) return <p>Loading...</p>;

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto p-6">
        <img
          src={blogDetails.thumbnail}
          alt="Thumbnail"
          className="w-full rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{blogDetails.title}</h1>
        <p className="text-sm text-gray-500 mb-2">
          Published on {new Date(blogDetails.createdAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2 mb-4">
          {blogDetails.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-sm text-gray-700 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blogDetails.description }}
        ></div>

        {isAdmin && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Blog
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Blog
            </button>
          </div>
        )}

        {isEditOpen && (
          <EditBlogModal
            blog={blogDetails}
            onClose={() => setIsEditOpen(false)}
            onEdit={handleEditSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default BlogDetails;
