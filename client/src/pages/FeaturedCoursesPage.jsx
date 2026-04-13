import SearchBar from "@/components/courses/SearchBar";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import React, { useState } from "react";

const FeaturedCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  return (
    <DefaultLayout>
      <div className=" mx-auto flex items-center justify-center flex-col">
        <PageHeader title="Course catalog & highlights" breadcrumb="Courses" />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <FeaturedCourses width={"100%"} searchQuery={searchQuery} />
      </div>
    </DefaultLayout>
  );
};

export default FeaturedCoursesPage;
