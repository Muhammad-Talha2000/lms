import React from "react";
import { VideoIcon } from "lucide-react";
import { FaLongArrowAltRight } from "react-icons/fa";

const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const TopCourses = ({ courses = [], isLoading = false }) => {
  return (
    <div className="w-full max-w-full min-w-0 flex flex-col px-0">
      <h1 className="text-orange-500 font-bold text-lg">Top Courses</h1>
      {isLoading ? (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 my-2 bg-[#f6f8fd] rounded-lg p-4 min-w-0">
          <p className="text-gray-500 text-sm">Loading top courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 my-2 bg-[#f6f8fd] rounded-lg p-4 min-w-0">
          <p className="text-gray-500 text-sm">No courses available yet.</p>
        </div>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-2 bg-[#f6f8fd] rounded-lg p-4 min-w-0"
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <VideoIcon className="w-8 h-8 text-orange-500 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold break-words">{course.name}</h3>
                <p className="text-gray-500 text-sm truncate">
                  #{course._id?.slice(-4)}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-left sm:text-right min-w-0">
              <h3 className="font-bold text-orange-500 whitespace-nowrap sm:whitespace-normal">
                {pkr.format(Number(course.price) || 0)}
              </h3>
              <p className="text-gray-500 text-sm">
                {course.enrolledStudents?.length || 0} Subscribers
              </p>
            </div>
          </div>
        ))
      )}
      <span className="text-orange-500 justify-end flex gap-4 font-bold items-center mt-4 cursor-pointer hover:text-orange-600">
        View all <FaLongArrowAltRight />
      </span>
    </div>
  );
};

export default TopCourses;
