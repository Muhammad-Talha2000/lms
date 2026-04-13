import DefaultLayout from "@/components/layout/DefaultLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";

const Careers = () => {
  return (
    <DefaultLayout>
      <PageHeader title="Careers at Smartflow" breadcrumb="Careers" />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 text-gray-700 leading-relaxed">
        <p className="mb-4">
          We are growing a remote-friendly team across product, customer success, and
          learning design. If you care about equitable education and polished learner
          experiences, we would like to hear from you.
        </p>
        <p className="mb-4">
          Open roles are filled on a rolling basis. Send a short introduction, your
          portfolio or résumé, and the type of role you are pursuing—we will respond when
          there is a mutual fit.
        </p>
        <p className="mb-8 text-sm text-gray-600">
          Email:{" "}
          <a
            href="mailto:smartflowtechofficial@gmail.com?subject=Careers%20inquiry"
            className="font-medium text-orange-600 hover:underline"
          >
            smartflowtechofficial@gmail.com
          </a>
        </p>
        <Link
          to="/contact"
          className="inline-flex rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Use the contact form
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default Careers;
