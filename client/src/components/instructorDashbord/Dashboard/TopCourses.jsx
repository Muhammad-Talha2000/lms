import React from "react";
import { VideoIcon } from "lucide-react";
import { FaLongArrowAltRight } from "react-icons/fa";

const TopCourses = () => {
  return (
    <div className="container flex flex-col">
      <h1 className="text-orange-500 font-bold  text-lg">Top Courses</h1>
      <div className="flex justify-between my-2 bg-[#f6f8fd] rounded-lg p-4">
        <div className="flex items-center  gap-4">
          <VideoIcon className="w-8 h-8 text-orange-500" />
          <div>
            <h3 className="font-bold">React Native</h3>
            <p className="text-gray-500 text-sm">#5436</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-orange-500">RS. 1500/-</h3>
          <p className="text-gray-500 text-sm">131 Subscribers</p>
        </div>
      </div>
      <div className="flex justify-between my-2 bg-[#f6f8fd] rounded-lg p-4">
        <div className="flex items-center  gap-4">
          <VideoIcon className="w-8 h-8 text-orange-500" />
          <div>
            <h3 className="font-bold">React Native</h3>
            <p className="text-gray-500 text-sm">#5436</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-orange-500">RS. 1500/-</h3>
          <p className="text-gray-500 text-sm">131 Subscribers</p>
        </div>
      </div>
      <div className="flex justify-between my-2 bg-[#f6f8fd] rounded-lg p-4">
        <div className="flex items-center  gap-4">
          <VideoIcon className="w-8 h-8 text-orange-500" />
          <div>
            <h3 className="font-bold">React Native</h3>
            <p className="text-gray-500 text-sm">#5436</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-orange-500">RS. 1500/-</h3>
          <p className="text-gray-500 text-sm">131 Subscribers</p>
        </div>
      </div>
      <span className="text-orange-500 justify-end flex gap-4 font-bold items-center mt-4 cursor-pointer hover:text-orange-600">
        View all <FaLongArrowAltRight />
      </span>
    </div>
  );
};

export default TopCourses;
