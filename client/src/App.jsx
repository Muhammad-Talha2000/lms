import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Faqs from "./pages/Faqs";
import InstructorDashboard from "./pages/InstructorDashboard";
import FeaturedCoursesPage from "./pages/FeaturedCoursesPage";
import ProfilePage from "./pages/ProfilePage";
import Admin from "./pages/Admin";
import ManageCourse from "./pages/ManageCourse";
import LearningPage from "./pages/LearningPage";
// import Checkout from "./components/Payments method/Checkout";
import PersonalDetailsPage from "./pages/PersonalDetailsPage";
import CourseDetails from "./components/coure details/CourseDetails";
import CourseDetailsChck from "./components/admin/CourseDetailsCheck";
import ClassDetails from "./components/Classes/ClassDetails";
import SubjectDetails from "./components/Classes/Subject/SubjectDetails";
import ForgotPassword from "./components/password/ForgotPassword";
import ResetPassword from "./components/password/ResetPassword";
import NotFound from "./pages/NotFound";
import FeaturedClassess from "./pages/FeaturedClassess";
import InstructorsClassessPage from "./pages/InstructorsClassessPage";
import AdminMeetings from "./pages/AdminMeetings";
import BlogsPage from "./pages/BlogsPage";
import BlogDetails from "./pages/BlogDetails";

// hello

const Layout = () => (
  <>
    {/* <Navbar /> Navbar included */}
    <Outlet /> {/* Renders child routes */}
  </>
);

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Wrap everything in Layout
      children: [
        { path: "/", element: <Homepage /> },
        { path: "login", element: <Login /> },
        { path: "personal-details", element: <PersonalDetailsPage /> },
        { path: "contact", element: <Contact /> },
        { path: "courses", element: <FeaturedCoursesPage /> },
        { path: "classess", element: <FeaturedClassess /> },
        { path: "faqs", element: <Faqs /> },
        { path: "courseDetails/:id", element: <CourseDetails /> },
        { path: "instructorDashboard", element: <InstructorDashboard /> },
        { path: "profile", element: <ProfilePage /> },
        // { path: "stipe-payment", element: <Checkout /> },
        // { path: "editProfile", element: <EditProfile /> },
        { path: "admin", element: <Admin /> },
        { path: "manageCourse/:id", element: <ManageCourse /> },
        { path: "learner-page/:id", element: <LearningPage /> },
        { path: "class/:id", element: <ClassDetails /> },
        { path: "/subject/:subjectId", element: <SubjectDetails /> },
        { path: "/instructorsclassess", element: <InstructorsClassessPage /> },
        // { path: "subject", element: <SubjectDetails /> },
        { path: "checking-course/:id", element: <CourseDetailsChck /> },
        { path: "forgotPassword", element: <ForgotPassword /> },
        { path: "blogs", element: <BlogsPage /> },
        { path: "blogs/:id", element: <BlogDetails /> },
        { path: "resetPassword/:id", element: <ResetPassword /> },
        { path: "admin-meetings", element: <AdminMeetings /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />; // Ensure this is returned
};

export default App;
