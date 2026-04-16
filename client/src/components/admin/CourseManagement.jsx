import React, { useEffect, useState } from "react";
import { getCourses, publishCourse } from "@/services/courseService";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";

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
    <div className="mx-auto w-full max-w-7xl space-y-5 py-2">
      <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50/60 p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Course Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review published status and open a course for details.
        </p>
      </section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses?.map((course) => (
          <div
            key={course._id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <BookOpen className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="p-4">
            <Link to={`/checking-course/${course._id}`}>
              <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">
                {course.name}
              </h2>
            </Link>
            <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {course?.enrolledStudents?.length || 0} students
              </span>
              <span>{course?.lessons?.length || 0} lessons</span>
            </div>
            <div className="flex items-center justify-between">
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
                className={`px-4 py-2 text-white rounded-lg shadow-sm text-sm font-medium flex items-center justify-center ${
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
