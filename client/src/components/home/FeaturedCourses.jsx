import React, { useEffect, useState } from "react";
import { FaBook, FaUser, FaEye } from "react-icons/fa";
import { AiFillStar, AiFillThunderbolt } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getCourses } from "@/services/courseService";
import { HiUsers } from "react-icons/hi2";
import { SiGoogleclassroom } from "react-icons/si";
import { PiRecordFill } from "react-icons/pi";

const FeaturedCourses = ({ bgColor, width, searchQuery }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  const [selectedFilter, setSelectedFilter] = useState("All"); // Default filter

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("🔹 [FeaturedCourses] Fetching courses...");
        const data = await getCourses();
        console.log("📊 [FeaturedCourses] All courses from API:", data);
        
        if (!data || data.length === 0) {
          console.warn("⚠️ [FeaturedCourses] No courses received from API");
          setCourses([]);
          setFilteredCourses([]);
          return;
        }
        
        // Filter only published courses
        const publishedCourses = data.filter((course) => course.published);
        console.log(`✅ [FeaturedCourses] Published courses: ${publishedCourses.length}/${data.length}`);
        
        setCourses(publishedCourses);
        setFilteredCourses(publishedCourses); // Initially, show published courses
      } catch (error) {
        console.error("❌ [FeaturedCourses] Error while fetching the courses", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let updatedCourses = courses;

    if (selectedFilter !== "All") {
      updatedCourses = updatedCourses.filter(
        (course) => course.courseType === selectedFilter
      );
    }

    if (searchQuery) {
      updatedCourses = updatedCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
      );
    }

    setFilteredCourses(updatedCourses);
  }, [selectedFilter, searchQuery, courses]);

  const filters = ["All", "Recorded", "Live", "One-to-One"];

  return (
    <div style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto py-12 " style={{ width: width }}>
        {/* Heading Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center">
            <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
              <div className="p-1 bg-[#daf2f0] rounded-full">
                <AiFillThunderbolt color="ea580c" />
              </div>
              Top class courses
            </span>
          </div>
          <h2 className="text-3xl font-bold mt-4">Explore Featured Courses</h2>
        </div>

        {/* Dynamic Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {filters?.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium shadow-md transition ${
                selectedFilter === filter
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-orange-100 hover:text-orange-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Courses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses?.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-md overflow-hidden transition transform hover:-translate-y-2 pb-4"
              >
                {/* Course Image */}
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-52 object-cover p-4"
                />

                {/* Course Details */}
                <div className="px-4">
                  {/* <p className="bg-orange-100 p-2 my-2 w-fit mx-auto rounded-full text-orange-500 text-sm font-bold text-center">
                    {course.courseType}
                  </p> */}
                  <h3 className="text-lg font-bold">{course.name}</h3>

                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-4">
                    <div className="flex items-center gap-1">
                      <FaBook className="w-4 h-4" />
                      {course?.lessons?.length || 0} Lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUser className="w-4 h-4" />
                      {course?.enrolledStudents?.length || 0} Students
                    </div>
                    <div className="flex items-center gap-1 w-full sm:w-auto">
                      {course.courseType === "Recorded" ? (
                        <PiRecordFill className="w-4 h-4 text-red-500" />
                      ) : course.courseType === "Live" ? (
                        <SiGoogleclassroom className="w-5 h-5 text-green-500" />
                      ) : (
                        <HiUsers className="w-4 h-4 text-blue-500" />
                      )}
                      {course?.courseType}
                    </div>
                  </div>

                  {/* Instructor and rating */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          course.instructor?.profileImage ||
                          "https://via.placeholder.com/40x40.png?text=KP"
                        }
                        alt={course.instructor?.name || "Unknown Instructor"}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-sm text-gray-900 flex flex-col">
                        <span className="font-bold">
                          {course.instructor?.name || "Unknown"}
                        </span>
                        <span className="text-orange-500 text-xs">
                          Instructor
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      {[...Array(5)].map((_, index) => (
                        <AiFillStar key={index} className="w-3 h-3" />
                      ))}
                    </div>
                  </div>

                  {/* Price and View Details button */}
                  <div className="flex items-center justify-between mt-4 border-t-2 border-[#e8f0f3] pt-4">
                    <p className="font-bold text-gray-800">
                      Rs. {course?.price || "Free"}
                    </p>
                    <Link
                      to={`/courseDetails/${course._id}`}
                      className="hover:bg-[#e8f0f3] border-2 border-[#e8f0f3] py-2 px-4 rounded-full font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              No courses found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
