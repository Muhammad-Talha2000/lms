import Certifications from "@/components/home/Certifications";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Hero from "@/components/home/HeroSection";
import InstructorsDetails from "@/components/home/InstructorsDetails";
import PerformanceDashboard from "@/components/home/PerformanceDashboard";
import PublicStatsDashboard from "@/components/home/PublicStatsDashboard";
import StatsSection from "@/components/home/StatsSection";
import SuccessStories from "@/components/home/SuccessStories";
import DefaultLayout from "@/components/layout/DefaultLayout";
import React from "react";

const Homepage = () => {
  return (
    <DefaultLayout>
      <div className="w-full max-w-full overflow-x-hidden box-border px-3 sm:px-4 md:px-6">
        <Hero />
        <SuccessStories />
        <FeaturedCourses bgColor={"#e8f0f3"} />
        <PublicStatsDashboard />
        <StatsSection />
        <PerformanceDashboard />
        <InstructorsDetails />
        <Certifications />
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
