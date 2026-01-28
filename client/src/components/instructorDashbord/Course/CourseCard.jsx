import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUser } from "react-icons/fa";
import { MdAssignmentTurnedIn, MdQuiz } from "react-icons/md";
import { Card } from "@/components/ui/card";

const CourseCard = ({ courses }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Course Cards */}
        {courses?.map((course) => (
          <Card
            key={course._id}
            className="bg-white  border-2 border-gray-200 rounded-2xl cursor-pointer pb-4 "
          >
            {/* Course Image */}
            <div className="overflow-hidden rounded-2xl p-2">
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-40 object-cover rounded-lg" // Change rounded-lg to rounded-2xl
              />
            </div>

            {/* Course Details */}
            <div className="px-4">
              <h3 className="text-lg font-bold ">{course.name}</h3>

              {/* Course Stats */}
              <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <FaBook className="w-4 h-4" />
                  {course?.lessons?.length || 0} Lessons
                </div>
                <div className="flex items-center gap-1">
                  <FaUser className="w-4 h-4" />
                  {course?.enrolledStudents?.length || 0} Students
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <MdQuiz className="w-4 h-4" />
                  {course?.quizzes?.length || 0} Quizzes
                </div>
                <div className="flex items-center gap-1">
                  <MdAssignmentTurnedIn className="w-4 h-4" />
                  {course?.assignments?.length || 0} Assignments
                </div>
              </div>

              {/* Instructor Details */}

              {/* Price and Manage Course button */}
              <div className="flex items-center justify-between mt-4 border-t-2 border-[#e8f0f3] pt-4">
                <p className="font-bold text-gray-800">
                  Rs. {course?.price || "Free"}
                </p>

                {/* Manage Course Button */}
                <Link
                  to={`/manageCourse/${course._id}`} // Link to manage course page
                  className="hover:bg-orange-100 border-2 border-orange-100 py-2 px-4 rounded-full font-medium"
                >
                  Manage Course
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
