import PerformanceDashboard from "@/components/home/PerformanceDashboard";
import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";

const Faqs = () => {
  return (
    <DefaultLayout>
      <PageHeader title="Frequently asked questions" breadcrumb="Help" />
      <PerformanceDashboard />
    </DefaultLayout>
  );
};

export default Faqs;
