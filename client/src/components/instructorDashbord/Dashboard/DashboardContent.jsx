import React from "react";
import Genres from "./Genres";
import TopCourses from "./TopCourses";
import UpcmingTasks from "./UpcmingTasks";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";

const DashboardContent = () => {
  return (
    <main className="flex flex-col gap-8 w-[80%]">
      <div className="flex gap-8">
        <Genres title="Live Courses" description="14" />
        <Genres
          title="Videos"
          description="277"
          Icon={MdOutlineVideoLibrary}
          padding={2}
        />
        <Genres title="Students" description="31" Icon={HiUsers} padding={2} />
        <Genres title="Earning" description="RS. 1,200" />
      </div>
      <div className="flex gap-4 ">
        <TopCourses />
        <UpcmingTasks />
      </div>
    </main>
  );
};

export default DashboardContent;
