import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { AiFillStar, AiFillThunderbolt } from "react-icons/ai";
import { PiRecordFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import ClassService from "@/services/classService";

const FeaturedClass = ({ bgColor, width, searchQuery }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await ClassService.getClasses();
        setClasses(data);
        setFilteredClasses(data);
      } catch (error) {
        console.log("Error while fetching classes", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    let updatedClasses = classes;

    if (selectedFilter !== "All") {
      updatedClasses = updatedClasses.filter(
        (classItem) => classItem.classType === selectedFilter
      );
    }

    if (searchQuery) {
      updatedClasses = updatedClasses.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClasses(updatedClasses);
  }, [selectedFilter, searchQuery, classes]);

  const filters = ["All", "Recorded", "Live", "One-to-One"];

  return (
    <div style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto py-12" style={{ width: width }}>
        {/* Heading Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center">
            <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
              <div className="p-1 bg-[#daf2f0] rounded-full">
                <AiFillThunderbolt color="ea580c" />
              </div>
              Structured cohort experiences
            </span>
          </div>
          <h2 className="text-3xl font-bold mt-4">Browse featured classes & cohorts</h2>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white border-2 rounded-md shadow-md overflow-hidden transition transform hover:-translate-y-2 pb-4"
              >
                {/* Class Details */}
                <div className="px-4">
                  <h3 className="text-lg font-bold mt-4 text-orange-500">
                    {classItem.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {classItem.description}
                  </p>

                  {/* Class Stats */}
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
                  <div className="flex items-center justify-between mt-4 border-t-2 border-orange-500 pt-4">
                    <p className="font-bold text-gray-800">
                      $. {classItem?.price || "Free"}
                    </p>
                    <Link
                      to={`/class/${classItem._id}`}
                      className="hover:bg-orange-100 border-2 border-orange-300 py-2 px-4 rounded-full font-medium"
                    >
                      Open class overview
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              No classes match this search—adjust filters or keywords.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedClass;
