import { useState, useEffect } from "react";
import Sidebar from "@/components/instructorDashbord/Dashboard/Sidebar";
import DefaultLayout from "@/components/layout/DefaultLayout";
import {
  LayoutGrid,
  BookOpen,
  Users,
  Video,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { MdOutlineSpatialAudioOff, MdOutlineUploadFile } from "react-icons/md";
import DashboardContent from "@/components/instructorDashbord/Dashboard/DashboardContent";
import CourseContent from "@/components/instructorDashbord/Course/CourseContent";
import StudentsContent from "@/components/instructorDashbord/Students/StudentsContent";
import LiveClassessContent from "@/components/instructorDashbord/LiveClasses/LiveClassessContent";
import AddCourseContent from "@/components/instructorDashbord/AddCourse/AddCourseContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OneToOneContent from "@/components/instructorDashbord/LiveClasses/OneToOneContent";
import InstructorClassesContent from "@/components/instructorDashbord/Classes/InstructorClassesContent";

const instructorMenuItems = [
  { name: "Dashboard", icon: LayoutGrid },
  { name: "Course", icon: BookOpen },
  { name: "My classes", icon: GraduationCap },
  { name: "Students", icon: Users },
  { name: "Live Classes", icon: Video },
  { name: "One to One", icon: MdOutlineSpatialAudioOff },
  { name: "Add new course", icon: MdOutlineUploadFile },
];

const InstructorDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return localStorage.getItem("selectedMenu") || "Dashboard";
  });
  const [instructorNavOpen, setInstructorNavOpen] = useState(false);

  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
    }

    if (loggedinUser && loggedinUser.user.role !== "instructor") {
      navigate("/profile");
    }
    return;
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  useEffect(() => {
    if (!instructorNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [instructorNavOpen]);

  const handleMenuSelect = (name) => {
    setSelectedMenu(name);
    setInstructorNavOpen(false);
  };

  const handleViewAllTasks = () => {
    setSelectedMenu("Course");
    setInstructorNavOpen(false);
  };

  return (
    <DefaultLayout>
      <div className="w-full max-w-full overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10 box-border">
        <div className="lg:hidden flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-200">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
            onClick={() => setInstructorNavOpen(true)}
            aria-expanded={instructorNavOpen}
            aria-label="Open instructor menu"
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
          <span className="text-sm font-semibold text-orange-600 truncate max-w-[55%]">
            {selectedMenu}
          </span>
        </div>

        {instructorNavOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close menu"
            onClick={() => setInstructorNavOpen(false)}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
          <aside
            className={`
              fixed lg:static z-50 lg:z-0
              left-0 top-14 sm:top-16 bottom-0 lg:top-auto lg:bottom-auto
              w-[min(88vw,280px)] lg:w-auto lg:min-w-[240px]
              transform transition-transform duration-200 ease-out
              ${instructorNavOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0
              lg:sticky lg:top-24 lg:self-start
              max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] lg:max-h-[calc(100vh-6rem)] overflow-y-auto
              bg-enterprise-navy p-2 sm:p-3 lg:rounded-r-2xl
            `}
          >
            <div className="flex shrink-0 justify-end rounded-t-lg border-b border-white/10 bg-enterprise-navy p-2 lg:hidden">
              <button
                type="button"
                className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
                onClick={() => setInstructorNavOpen(false)}
                aria-label="Close instructor menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar
              user={loggedinUser?.user}
              role="Instructor"
              headerTitle="Instructor"
              menuItems={instructorMenuItems}
              onSelect={handleMenuSelect}
            />
          </aside>

          <main className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0 w-full overflow-x-hidden overflow-y-visible">
            {selectedMenu === "Dashboard" && (
              <DashboardContent onViewAllTasks={handleViewAllTasks} />
            )}
            {selectedMenu === "Course" && <CourseContent />}
            {selectedMenu === "My classes" && <InstructorClassesContent />}
            {selectedMenu === "Students" && <StudentsContent />}
            {selectedMenu === "One to One" && <OneToOneContent />}
            {selectedMenu === "Live Classes" && <LiveClassessContent />}
            {selectedMenu === "Add new course" && <AddCourseContent />}
          </main>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default InstructorDashboard;
