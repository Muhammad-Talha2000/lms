import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // If using Redux
import ClassService from "@/services/classService";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { FaBookOpen, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const InstructorsClassessPage = () => {
  const loggedinUser = useSelector((state) => state.auth.loggedinUser); // Corrected state access

  const [instructorClasses, setInstructorClasses] = useState([]);

  useEffect(() => {
    if (loggedinUser) {
      fetchClasses();
    }
  }, [loggedinUser]);

  const fetchClasses = async () => {
    try {
      const response = await ClassService.getClasses();

      // Filter classes where the logged-in user is assigned as a subject instructor
      const filteredClasses = response.filter((classItem) =>
        classItem.subjects.some(
          (subject) => subject.instructor === loggedinUser.user._id
        )
      );

      setInstructorClasses(filteredClasses);
    } catch (error) {
      console.error("Error while fetching classes:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className=" p-4 px-12">
        <h1 className="font-bold text-3xl  mb-12 text-center">
          Your respected Classess
        </h1>

        {instructorClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorClasses.map((classItem) => (
              <div
                key={classItem._id}
                className="p-4 border-2 rounded-md  shadow-md overflow-hidden transition transform hover:-translate-y-2"
              >
                <h2 className="text-xl font-bold text-orange-500">
                  {classItem.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {classItem.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-gray-700 text-sm mt-4">
                  <div className="flex items-center gap-1">
                    <FaUsers className="w-4 h-4" />
                    {classItem?.students?.length || 0} Students
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBookOpen className="w-4 h-4" />
                    {classItem?.subjects?.length || 0} Subjects
                  </div>
                </div>

                {/* Price and View Details button */}
                <div className="flex items-center justify-start mt-4 border-t-2 border-orange-500 pt-4 ">
                  <Link
                    to={`/class/${classItem._id}`}
                    className="hover:bg-orange-100 border-2 border-orange-300 py-2 px-4 rounded-full font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No classes found.</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default InstructorsClassessPage;
