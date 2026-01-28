import React, { useEffect, useState } from "react";
import { getCourses, publishCourse } from "@/services/courseService";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(null); // To track the loading state of a specific course
  const { loggedinUser } = useSelector((state) => state.auth);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Handle course publish/unpublish toggle
  // const handlePublishToggle = async (courseId, currentStatus) => {
  //   setLoading(courseId); // Set loading for the specific course
  //   try {
  //     console.log("sending ", courseId, !currentStatus);
  //     const updatedCourse = await publishCourse(
  //       courseId,
  //       !currentStatus,
  //       loggedinUser.token
  //     );
  //     await getCourses();
  //   } catch (error) {
  //     console.error("Error updating course status:", error);
  //     alert("Failed to update course status. Please try again.");
  //   }finally {
  //     setLoading(null); // Reset loading state
  //   }
  // };
  const handlePublishToggle = async (courseId, currentStatus) => {
    setLoading(courseId); // Set loading for the specific course
    try {
      const updatedCourse = await publishCourse(
        courseId,
        !currentStatus,
        loggedinUser.token
      );

      // Update the course list in real time
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, published: !currentStatus }
            : course
        )
      );
    } catch (error) {
      console.error("Error updating course status:", error);
      alert("Failed to update course status. Please try again.");
    } finally {
      setLoading(null); // Reset loading state
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Course Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={course.thumbnail}
              alt={course.name}
              className="w-full h-40 object-c
              over rounded-lg mb-4"
            />
            <Link to={`/checking-course/${course._id}`}>
              <h2
                onClick={() => navigate(`/learner-page/${id}`)}
                className="text-lg font-bold mb-2"
              >
                {course.name}
              </h2>
            </Link>
            {/* <p className="text-gray-600 mb-4">{course.description}</p> */}
            {/* <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.published
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {course.published ? "Published" : "Unpublished"}
              </span>
              <button
                onClick={() =>
                  handlePublishToggle(course._id, course.published)
                }
                className={`px-4 py-2 text-white rounded-lg shadow ${
                  course.published
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {course.published ? "Unpublish" : "Publish"}
              </button>
            </div> */}
            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.published
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {course.published ? "Published" : "Unpublished"}
              </span>
              <button
                onClick={() =>
                  handlePublishToggle(course._id, course.published)
                }
                className={`px-4 py-2 text-white rounded-lg shadow flex items-center justify-center ${
                  course.published
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={loading === course._id} // Disable button while loading
              >
                {loading === course._id
                  ? "Processing..."
                  : course.published
                  ? "Unpublish"
                  : "Publish"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
