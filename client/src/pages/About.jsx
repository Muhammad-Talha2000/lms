import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <DefaultLayout>
      <PageHeader title="Who we are" breadcrumb="About" />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 text-gray-700 leading-relaxed">
        <p className="mb-4">
          NexaLearn is an online learning platform built for teams and individuals who
          want structured programs, clear progress tracking, and instructors who stay
          involved from day one to certification.
        </p>
        <p className="mb-4">
          We combine live sessions, on-demand lessons, and collaborative class spaces so
          learners can balance work, study, and real-world projects without losing
          momentum.
        </p>
        <p className="mb-8">
          Whether you are upskilling in your current role or preparing for a new one,
          our catalog spans professional disciplines—with pricing and formats designed
          to stay accessible.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/courses"
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Browse courses
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default About;
