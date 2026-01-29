import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setLoggedinUser } from "@/redux/authSlice";
import { resetCourse } from "@/redux/courseSlice";
import SearchInput from "../Filters/SearchInput";
import { logoutUser } from "@/services/authService";

const Navbar = () => {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loggedinUser } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await logoutUser(loggedinUser.user._id);
    setIsProfileOpen(false);
    dispatch(setLoggedinUser(null));
    dispatch(resetCourse());
    localStorage.setItem("selectedMenu", "Dashboard");
    localStorage.setItem("selectedMenuTab", "User Management");
    navigate("/");
  };
  const isActive = (path) => location.pathname === path;
  // Function to render navigation links based on user role
  const renderNavLinks = () => {
    // If user is not logged in, show default nav links
    if (!loggedinUser?.token) {
      return (
        <>
          <Link
            to="/"
            className={`font-semibold px-3 py-2 ${
              isActive("/") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            HOME
          </Link>
          <div className="relative">
            <button
              className="text-gray-600 hover:text-orange-500 font-semibold px-3 py-2 flex items-center"
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
            >
              <Link
                to="/courses"
                className={`${
                  isActive("/courses") ? "text-orange-500" : "text-gray-600"
                }`}
              >
                COURSES
              </Link>
            </button>
          </div>
          <Link
            to="/classess"
            className={`font-semibold px-3 py-2 ${
              isActive("/classess") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            CLASSESS
          </Link>
          <Link
            to="/faqs"
            className={`font-semibold px-3 py-2 ${
              isActive("/faqs") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={`font-semibold px-3 py-2 ${
              isActive("/contact") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            CONTACT
          </Link>
        </>
      );
    }

    // If user is logged in and is an instructor
    if (loggedinUser?.user?.role === "instructor") {
      return (
        <>
          <Link
            to="/"
            className={`font-semibold px-3 py-2 ${
              isActive("/") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            HOME
          </Link>
          <Link
            to="/instructordashboard"
            className={`font-semibold px-3 py-2 ${
              isActive("/instructordashboard")
                ? "text-orange-500"
                : "text-gray-600"
            } hover:text-orange-500`}
          >
            DASHBOARD
          </Link>
          <Link
            to="/instructorsclassess"
            className={`font-semibold px-3 py-2 ${
              isActive("/instructorsclassess")
                ? "text-orange-500"
                : "text-gray-600"
            } hover:text-orange-500`}
          >
            CLASSESS
          </Link>
          <Link
            to="/contact"
            className={`font-semibold px-3 py-2 ${
              isActive("/contact") ? "text-orange-500" : "text-gray-600"
            } hover:text-orange-500`}
          >
            CONTACT
          </Link>
        </>
      );
    }

    // If user is logged in and is a student
    return (
      <>
        <Link
          to="/"
          className={`font-semibold px-3 py-2 ${
            isActive("/") ? "text-orange-500" : "text-gray-600"
          } hover:text-orange-500`}
        >
          HOME
        </Link>

        <Link
          to="/courses"
          className={`font-semibold px-3 py-2 ${
            isActive("/courses") ? "text-orange-500" : "text-gray-600"
          } hover:text-orange-500`}
        >
          COURSES
        </Link>

        <Link
          to="/classess"
          className={`font-semibold px-3 py-2 ${
            isActive("/classess") ? "text-orange-500" : "text-gray-600"
          } hover:text-orange-500`}
        >
          CLASSESS
        </Link>

        <Link
          to="/faqs"
          className={`font-semibold px-3 py-2 ${
            isActive("/faqs") ? "text-orange-500" : "text-gray-600"
          } hover:text-orange-500`}
        >
          FAQ
        </Link>
        <Link
          to="/contact"
          className={`font-semibold px-3 py-2 ${
            isActive("/contact") ? "text-orange-500" : "text-gray-600"
          } hover:text-orange-500`}
        >
          CONTACT
        </Link>
      </>
    );
  };

  // Function to render profile dropdown menu based on user role
  const renderProfileMenu = () => {
    if (loggedinUser?.user?.role === "instructor") {
      return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => setIsProfileOpen(false)}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <div className="w-full border-b fixed top-0 z-10 bg-white shadow-lg">
      <div className="container mx-auto px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              <span className="text-gray-900">SMARTFLOW</span>
              <span className="text-orange-500"></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {renderNavLinks()}
          </div>

          {/* Right Side: Search + Auth Section */}
          <div className="flex items-center space-x-4">
            <div
            // className="text-white px-4 py-2 hover:bg-orange-600 rounded-3xl flex items-center gap-2 bg-orange-500"
            >
              {/* <Search className="h-5 w-5" />
              Search */}
              {/* <Input
              
              type="email" placeholder="Search..." />
              <CiSearch /> */}
              {/* <div className="focus:outline-none transition-all duration-300 ease-in-out w-5 focus:w-44"> */}

              <SearchInput
                isHeader={true}
                className="bg-orange-500 text-white rounded-full focus:outline-none"
                onSearch={(query) => console.log("Header Search:", query)}
              />
              {/* </div> */}
            </div>

            {/* If user is logged in, show profile dropdown */}
            {loggedinUser?.token ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img
                    src={
                      loggedinUser?.user?.profileImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCBLi1pUh1ZuL0FTKyuKnNxoeq4MWNxSXRfg&s"
                    }
                    alt={loggedinUser?.user?.name}
                    // className="w-10 h-10 rounded-full object-cover"
                    className={`font-semibold px-[1px] py-[1px] ${
                      isActive("/profile")
                        ? "w-10 h-10 rounded-full object-cover border-2 border-orange-500 "
                        : "w-10 h-10 rounded-full object-cover "
                    } hover:text-orange-500 border-2 `}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold">
                      {loggedinUser?.user?.name}
                    </span>
                    <span className="text-xs text-orange-500">
                      {loggedinUser?.user?.role}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && renderProfileMenu()}
              </div>
            ) : (
              // If user is not logged in, show login/signup button
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-3xl"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
