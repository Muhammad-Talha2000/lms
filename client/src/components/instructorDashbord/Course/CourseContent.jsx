import { getCourses } from "@/services/courseService";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useSelector } from "react-redux";

const CourseContent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loggedinUser } = useSelector((state) => state.auth);
  const instructorId = loggedinUser?.user?._id;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        console.log(data);

        // Filter courses by instructor's ID before setting them in the state
        const filteredCourses = data.filter(
          (course) => course?.instructor?._id === instructorId
        );

        setCourses(filteredCourses);
        setLoading(false);
      } catch (error) {
        console.log("Error while fetching courses", error);
      }
    };
    fetchCourses();
  }, [instructorId]);

  if (loading) return <p>Loading....</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold my-4 text-center mb-12">
        <span className="text-orange-500 font-bold">Courses</span> offered by
        You!
      </h2>
      <CourseCard courses={courses} />
    </div>
  );
};

export default CourseContent;
