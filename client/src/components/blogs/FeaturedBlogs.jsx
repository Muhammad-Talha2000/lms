import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "@/services/blogServices";

const FeaturedBlogs = ({ refresh }) => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      setBlogs(res);
      setFiltered(res);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [refresh]);

  useEffect(() => {
    const filteredBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredBlogs);
  }, [search, blogs]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search blogs..."
          className="p-2 border rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        filtered.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default FeaturedBlogs;
