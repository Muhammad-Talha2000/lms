import { useState, useEffect } from "react";
import Sidebar from "@/components/instructorDashbord/Dashboard/Sidebar";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { LayoutGrid, BookOpen, Users, Video } from "lucide-react";
import { MdOutlineSpatialAudioOff, MdOutlineUploadFile } from "react-icons/md";
import DashboardContent from "@/components/instructorDashbord/Dashboard/DashboardContent";
import CourseContent from "@/components/instructorDashbord/Course/CourseContent";
import StudentsContent from "@/components/instructorDashbord/Students/StudentsContent";
import LiveClassessContent from "@/components/instructorDashbord/LiveClasses/LiveClassessContent";
import AddCourseContent from "@/components/instructorDashbord/AddCourse/AddCourseContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OneToOneContent from "@/components/instructorDashbord/LiveClasses/OneToOneContent";

const instructorMenuItems = [
  { name: "Dashboard", icon: LayoutGrid },
  { name: "Course", icon: BookOpen },
  { name: "Students", icon: Users },
  { name: "Live Classes", icon: Video },
  { name: "One to One", icon: MdOutlineSpatialAudioOff },
  { name: "Add new course", icon: MdOutlineUploadFile },
];

const InstructorDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return localStorage.getItem("selectedMenu") || "Dashboard";
  });

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

  return (
    <DefaultLayout>
      <div
        className=" flex justify-between p-[40px]  gap-6"
        // className="w-full mx-auto flex h-[80vh] items-center gap-8"
      >
        {/* Full screen height */}
        {/* Sidebar */}
        <div className="h-[400px] flex items-center justify-center sticky top-[20%]">
          <Sidebar
            user={loggedinUser.user}
            role="Instructor"
            headerTitle="Instructor"
            menuItems={instructorMenuItems}
            onSelect={setSelectedMenu} // Add function to update menu selection
          />
        </div>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col gap-8 h-full overflow-y-auto no-scrollbar pr-2">
          {selectedMenu === "Dashboard" && <DashboardContent />}
          {selectedMenu === "Course" && <CourseContent />}
          {selectedMenu === "Students" && <StudentsContent />}
          {selectedMenu === "One to One" && <OneToOneContent />}
          {selectedMenu === "Live Classes" && <LiveClassessContent />}
          {selectedMenu === "Add new course" && <AddCourseContent />}
        </main>
      </div>
    </DefaultLayout>
  );
};

export default InstructorDashboard;
