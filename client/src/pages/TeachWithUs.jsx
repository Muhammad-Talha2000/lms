import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";

const TeachWithUs = () => {
  return (
    <DefaultLayout>
      <PageHeader title="Teach with us" breadcrumb="Instructors" />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 text-gray-700 leading-relaxed">
        <p className="mb-4">
          We partner with subject-matter experts who enjoy mentoring cohorts, hosting
          live sessions, and refining curriculum alongside our academic team.
        </p>
        <p className="mb-4">
          Instructors use our dashboard to publish lessons, track attendance, review
          submissions, and stay in sync with admins—without juggling five different tools.
        </p>
        <p className="mb-8">
          Ready to apply? Create an account and reach out through the contact page with
          your specialty, sample outline, and availability—we will guide you through the
          next steps.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Log in or sign up
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TeachWithUs;
