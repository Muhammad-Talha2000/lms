import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const UpcmingTasks = () => {
  return (
    <div className="container px-8">
      <h1 className="font-semibold text-3xl mb-8">Upcoming Tasks</h1>
      <div className="border-l-4 border-orange-500 pl-4 my-4">
        <h1 className="font-semibold text-lg">Environment Discuss</h1>
        <p>01:00pm to 02:00pm</p>
      </div>
      <div className="border-l-4 border-orange-500 pl-4 my-4">
        <h1 className="font-semibold text-lg">Environment Discuss</h1>
        <p>01:00pm to 02:00pm</p>
      </div>
      <div className="border-l-4 border-orange-500 pl-4 my-4">
        <h1 className="font-semibold text-lg">Environment Discuss</h1>
        <p>01:00pm to 02:00pm</p>
      </div>
      <span className="text-orange-500 justify-end flex gap-4 font-bold items-center mt-4 cursor-pointer hover:text-orange-600">
        View all Tasks <FaLongArrowAltRight />
      </span>
    </div>
  );
};

export default UpcmingTasks;
