import PerformanceDashboard from "@/components/home/PerformanceDashboard";
import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";

const Faqs = () => {
  return (
    <DefaultLayout>
      <PageHeader title="FAQs" breadcrumb="faqs"/>
      <PerformanceDashboard />
    </DefaultLayout>
  );
};

export default Faqs;
