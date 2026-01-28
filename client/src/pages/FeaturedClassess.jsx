import SearchBar from "@/components/courses/SearchBar";
import FeaturedClass from "@/components/home/FeaturedClass";
import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import React, { useState } from "react";

const FeaturedClassess = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <DefaultLayout>
      <div className=" mx-auto flex items-center justify-center flex-col">
        <PageHeader title="Featured Classess" breadcrumb="class" />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <FeaturedClass width={"90%"} searchQuery={searchQuery} />
      </div>
    </DefaultLayout>
  );
};

export default FeaturedClassess;
