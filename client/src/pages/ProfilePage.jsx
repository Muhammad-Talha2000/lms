import DefaultLayout from "@/components/layout/DefaultLayout";
import React, { useEffect } from "react";
import Genres from "@/components/instructorDashbord/Dashboard/Genres";
import UpcmingTasks from "@/components/instructorDashbord/Dashboard/UpcmingTasks";
import PersonalDetails from "@/components/profile/PersonalDetails";
import TrialClassCard from "@/components/profile/TrialClassCard";
import { ChartNoAxesColumn } from "lucide-react";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentEnroll from "@/components/profile/StudentEnroll";

const ProfilePage = () => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
    }

    if (loggedinUser && loggedinUser.user.role !== "student") {
      navigate("/instructordashboard");
    }
  }, [navigate]);

  return (
    <DefaultLayout>
      <div className="flex justify-between py-[40px] pr-[40px]  gap-6">
        {/* Sidebar */}
        <div className="h-[400px] z-[9] flex items-center justify-center sticky top-[20%]">
          <PersonalDetails />
        </div>

        <main className="flex-1 flex flex-col gap-8 h-full overflow-y-auto no-scrollbar pr-2">
          <h1 className="text-4xl font-bold">
            Welcome to SMARTFLOW <span className="text-orange-500">LMS</span>
          </h1>

          <div className="flex gap-8">
            <Genres
              title="Learning Time"
              description="2h 37m"
              Icon={ChartNoAxesColumn}
              padding={1}
            />
            <Genres
              title="My Acivities"
              description="27 Tasks"
              Icon={VscCircleLargeFilled}
            />
          </div>

          {/* <div className="flex gap-4">
            <TrialClassCard />
            <UpcmingTasks />
          </div> */}

          <StudentEnroll />
        </main>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
