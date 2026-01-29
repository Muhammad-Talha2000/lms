import React from "react";
import { Phone, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[url('@/assets/footer.png')] bg-cover bg-center w-full text-white py-8">
      <div className="container mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Get in Touch Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              GET IN TOUCH!
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></span>
            </h3>
            <p className="text-gray-300 mb-4">
              Fusce varius, dolor tempor interdum tristisque bibendum.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span>(123) 123-1234</span>
              </div>
              <p>smartflowtechofficial@gmail.com</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-orange-500" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-orange-500" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-orange-500" />
            </div>
          </div>

          {/* Company Info Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              COMPANY INFO
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></span>
            </h3>
            <ul className="space-y-3">
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>About Us
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Resource Center
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Careers
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Instructor
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Become A Teacher
              </li>
            </ul>
          </div>

          {/* Useful Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              USEFUL LINKS
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></span>
            </h3>
            <ul className="space-y-3">
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>All Courses
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Digital Marketing
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Design & Branding
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>Storytelling & Voice Over
              </li>
              <li className="hover:text-orange-500 cursor-pointer flex items-center">
                <span className="mr-2">→</span>News & Blogs
              </li>
            </ul>
          </div>

          {/* Recent Posts Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative">
              RECENT POST
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500 mt-2"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <img
                  src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg"
                  alt="Post thumbnail"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium hover:text-orange-500 cursor-pointer">
                    Where Dreams Find A Home
                  </h4>
                  <p className="text-sm text-gray-400">8 Dec, 2024</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <img
                  src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg"
                  alt="Post thumbnail"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium hover:text-orange-500 cursor-pointer">
                    Where Dreams Find A Home
                  </h4>
                  <p className="text-sm text-gray-400">5 Dec, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
          Copyright © 2025 Smartflow Tech. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
