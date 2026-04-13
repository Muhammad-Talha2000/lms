import DefaultLayout from "@/components/layout/DefaultLayout";
import React, { useEffect, useState } from "react";
import Genres from "@/components/instructorDashbord/Dashboard/Genres";
import PersonalDetails from "@/components/profile/PersonalDetails";
import { ChartNoAxesColumn } from "lucide-react";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentEnroll from "@/components/profile/StudentEnroll";
import { Menu, X } from "lucide-react";

const ProfilePage = () => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profileNavOpen, setProfileNavOpen] = useState(false);

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
      return;
    }
    if (loggedinUser.user.role !== "student") {
      navigate("/instructordashboard");
    }
  }, [loggedinUser, navigate]);

  useEffect(() => {
    if (!profileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [profileNavOpen]);

  return (
    <DefaultLayout>
      <div className="w-full max-w-full overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10 box-border">
        <div className="lg:hidden flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm"
            onClick={() => setProfileNavOpen(true)}
            aria-expanded={profileNavOpen}
            aria-label="Open profile menu"
          >
            <Menu className="h-5 w-5 shrink-0" />
            Profile
          </button>
          <span className="text-sm font-semibold text-primary truncate max-w-[55%]">
            My learning
          </span>
        </div>

        {profileNavOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close profile menu"
            onClick={() => setProfileNavOpen(false)}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
          <aside
            className={`
              fixed lg:static z-50 lg:z-0
              left-0 top-14 sm:top-16 bottom-0 lg:top-auto lg:bottom-auto
              w-[min(88vw,300px)] lg:w-auto lg:min-w-[260px] lg:max-w-[320px]
              transform transition-transform duration-200 ease-out
              ${profileNavOpen ? "translate-x-0" : "-translate-x-full"}
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
                onClick={() => setProfileNavOpen(false)}
                aria-label="Close profile menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="lg:py-2">
              <PersonalDetails onNavigate={() => setProfileNavOpen(false)} />
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0 w-full overflow-x-hidden">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Welcome to SMARTFLOW{" "}
              <span className="text-primary">LMS</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
              <Genres
                title="Learning Time"
                description="2h 37m"
                Icon={ChartNoAxesColumn}
                padding={1}
              />
              <Genres
                title="My Activities"
                description="27 Tasks"
                Icon={VscCircleLargeFilled}
              />
            </div>

            <StudentEnroll />
          </main>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
