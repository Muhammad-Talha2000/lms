import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setLoggedinUser } from "@/redux/authSlice";
import { resetCourse } from "@/redux/courseSlice";
import SearchInput from "../Filters/SearchInput";
import { logoutUser } from "@/services/authService";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const getNavItems = () => {
    if (!loggedinUser?.token) {
      return [
        { to: "/", label: "Home" },
        { to: "/courses", label: "Courses" },
        { to: "/classess", label: "Classes" },
        { to: "/faqs", label: "FAQs" },
        { to: "/contact", label: "Contact" },
      ];
    }
    if (loggedinUser.user?.role === "instructor") {
      return [
        { to: "/", label: "Home" },
        { to: "/instructordashboard", label: "Dashboard" },
        { to: "/instructorsclassess", label: "Classes" },
        { to: "/contact", label: "Contact" },
      ];
    }
    if (loggedinUser.user?.role === "admin") {
      return [
        { to: "/", label: "Home" },
        { to: "/admin", label: "Admin" },
        { to: "/contact", label: "Contact" },
      ];
    }
    return [
      { to: "/", label: "Home" },
      { to: "/courses", label: "Courses" },
      { to: "/classess", label: "Classes" },
      { to: "/faqs", label: "FAQs" },
      { to: "/contact", label: "Contact" },
    ];
  };

  const linkClassDesktop = (path) =>
    `font-semibold px-3 py-2 rounded-md transition-colors ${
      isActive(path)
        ? "text-white bg-white/15"
        : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  const linkClassMobile = (path) =>
    `block w-full text-left font-semibold px-4 py-3 border-b border-gray-100 ${
      isActive(path) ? "text-blue-700 bg-blue-50" : "text-gray-700"
    } active:bg-gray-50`;

  const renderNavLinks = () => {
    if (!loggedinUser?.token) {
      const afterHome = getNavItems().filter(
        (item) => item.to !== "/" && item.to !== "/courses"
      );
      return (
        <>
          <Link to="/" className={linkClassDesktop("/")}>
            Home
          </Link>
          <div className="relative hidden md:block">
            <button
              type="button"
              className="text-slate-300 hover:text-white font-semibold px-3 py-2 flex items-center rounded-md hover:bg-white/10"
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              aria-expanded={isCoursesOpen}
              aria-label="Course catalog menu"
            >
              <Link
                to="/courses"
                className={`${
                  isActive("/courses") ? "text-white" : "text-slate-300"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                Courses
              </Link>
            </button>
          </div>
          {afterHome.map(({ to, label }) => (
            <Link key={`${to}-${label}`} to={to} className={linkClassDesktop(to)}>
              {label}
            </Link>
          ))}
        </>
      );
    }
    return (
      <>
        {getNavItems().map(({ to, label }) => (
          <Link key={`${to}-${label}`} to={to} className={linkClassDesktop(to)}>
            {label}
          </Link>
        ))}
      </>
    );
  };

  const renderNavLinksMobile = () =>
    getNavItems().map(({ to, label }) => (
      <Link
        key={`m-${to}-${label}`}
        to={to}
        className={linkClassMobile(to)}
        onClick={() => setMobileMenuOpen(false)}
      >
        {label}
      </Link>
    ));

  // Function to render profile dropdown menu based on user role
  const renderProfileMenu = () => {
    if (loggedinUser?.user?.role === "instructor") {
      return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
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
          Your profile
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    );
  };

  return (
    <div className="w-full border-b border-white/10 fixed top-0 z-50 bg-enterprise-navy shadow-lg shadow-black/20">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-16 max-w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 min-w-0">
          {/* Logo + mobile menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/20 p-2 text-slate-100 hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/"
              className="text-base sm:text-xl font-bold truncate"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-white tracking-tight">SMARTFLOW</span>
            </Link>
          </div>

          {/* Navigation Links — desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 shrink min-w-0">
            {renderNavLinks()}
          </div>

          {/* Right Side: Search + Auth */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 min-w-0">
            <div className="hidden sm:block min-w-0 max-w-[200px] lg:max-w-none">
              <SearchInput
                isHeader={true}
                className="rounded-full bg-orange-500 text-white focus:outline-none"
                onSearch={(query) => console.log("Header Search:", query)}
              />
            </div>

            {loggedinUser?.token ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1 sm:gap-2 min-w-0"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-expanded={isProfileOpen}
                  aria-label="Account menu"
                >
                  <img
                    src={
                      loggedinUser?.user?.profileImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCBLi1pUh1ZuL0FTKyuKnNxoeq4MWNxSXRfg&s"
                    }
                    alt={loggedinUser?.user?.name}
                    className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ${
                      isActive("/profile") ? "border-2 border-blue-400" : ""
                    } border-2 border-transparent`}
                  />
                  <div className="hidden sm:flex flex-col text-left min-w-0">
                    <span className="max-w-[8rem] truncate text-sm font-semibold text-white lg:max-w-[12rem]">
                      {loggedinUser?.user?.name}
                    </span>
                    <span className="truncate text-xs font-medium capitalize text-sky-300">
                      {loggedinUser?.user?.role}
                    </span>
                  </div>
                </button>
                {isProfileOpen && renderProfileMenu()}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-3xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white whitespace-nowrap hover:bg-orange-600"
              >
                Log in or sign up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 top-14 sm:top-16 bg-black/40 z-40"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="md:hidden fixed left-0 right-0 top-14 sm:top-16 bottom-0 z-40 bg-white border-t shadow-lg overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <nav className="flex flex-col py-2">
              {renderNavLinksMobile()}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">Search</p>
                <SearchInput
                  isHeader={true}
                  className="bg-orange-500 text-white rounded-full focus:outline-none w-full max-w-full"
                  onSearch={(query) => console.log("Header Search:", query)}
                />
              </div>
              {!loggedinUser?.token && (
                <Link
                  to="/login"
                  className="block mx-4 my-3 text-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in or sign up
                </Link>
              )}
              {loggedinUser?.token && (
                <div className="px-4 py-3 border-t border-gray-100 mt-2 space-y-2">
                  {loggedinUser.user?.role !== "instructor" && (
                    <Link
                      to="/profile"
                      className="block w-full text-left font-semibold py-2 text-gray-700"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      Your profile
                    </Link>
                  )}
                  <button
                    type="button"
                    className="block w-full text-left font-semibold py-2 text-red-600"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
