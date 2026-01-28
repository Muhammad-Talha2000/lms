import Certifications from "@/components/home/Certifications";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Hero from "@/components/home/HeroSection";
import InstructorsDetails from "@/components/home/InstructorsDetails";
import PerformanceDashboard from "@/components/home/PerformanceDashboard";
import StatsSection from "@/components/home/StatsSection";
import SuccessStories from "@/components/home/SuccessStories";
import DefaultLayout from "@/components/layout/DefaultLayout";
import React from "react";

const Homepage = () => {
  return (
    <DefaultLayout>
      <div className="w-[90%] mx-auto">
        <Hero />
        <SuccessStories />
        <FeaturedCourses bgColor={"#e8f0f3"} width={"90%"} />
        <StatsSection />
        <PerformanceDashboard />
        <InstructorsDetails />
        <Certifications />
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
