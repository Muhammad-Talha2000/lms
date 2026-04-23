import React from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="flex items-center text-gray-200 transition-colors hover:text-orange-400"
    >
      <span className="mr-2">→</span>
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="bg-[url('@/assets/footer.png')] bg-cover bg-center w-full text-white py-8">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Connect */}
          <div>
            <h3 className="relative mb-6 text-lg font-semibold pb-2">
              Connect with NexaLearn
              <span className="absolute bottom-0 left-0 h-0.5 w-12 bg-orange-500" />
            </h3>
            <p className="mb-4 text-gray-300">
              Tell us about your learning goals—we reply quickly with tailored program
              recommendations and onboarding guidance.
            </p>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-center">
                <Phone size={18} className="mr-2 shrink-0" />
                <a href="tel:+11231231234" className="hover:text-orange-400">
                  (123) 123-1234
                </a>
              </div>
              <p>
                <a
                  href="mailto:nexalearntechofficial@gmail.com"
                  className="hover:text-orange-400 break-all"
                >
                  nexalearntechofficial@gmail.com
                </a>
              </p>
            </div>
            <p className="mt-4">
              <Link
                to="/contact"
                className="text-sm font-semibold text-orange-400 hover:text-orange-300"
              >
                Contact form →
              </Link>
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="relative mb-6 text-lg font-semibold pb-2">
              Company
              <span className="absolute bottom-0 left-0 h-0.5 w-12 bg-orange-500" />
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/about">Who we are</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/teach-with-us">Teach with us</FooterLink>
            </ul>
          </div>

          {/* Explore — real app routes only */}
          <div>
            <h3 className="relative mb-6 text-lg font-semibold pb-2">
              Explore
              <span className="absolute bottom-0 left-0 h-0.5 w-12 bg-orange-500" />
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/courses">Courses</FooterLink>
              <FooterLink to="/classess">Classes</FooterLink>
              <FooterLink to="/blogs">Blog</FooterLink>
              <FooterLink to="/faqs">Help &amp; FAQs</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NexaLearn Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
