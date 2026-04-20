// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/instructorDashbord/Dashboard/Sidebar";
// import {
//   Users,
//   BookOpen,
//   CreditCard,
//   BarChart2,
//   Bell,
//   Settings,
//   LogOut,
// } from "lucide-react";

// import Notifications from "@/components/admin/Notifications";
// import UserManagement from "@/components/admin/UserManagement";
// import CourseManagement from "@/components/admin/CourseManagement";
// import PaymentManagement from "@/components/admin/PaymentManagement";
// import Analytics from "@/components/admin/Analytics";
// import PlatformSettings from "@/components/admin/PlatformSettings";
// import ClassManagement from "@/components/admin/ClassManagement";
// import { logoutUser } from "@/services/authService";
// import { setLoggedinUser } from "@/redux/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const adminMenuItems = [
//   { name: "User Management", icon: Users },
//   { name: "Course Management", icon: BookOpen },
//   { name: "Class Management", icon: BookOpen },
//   { name: "Payment Management", icon: CreditCard },
//   { name: "Analytics", icon: BarChart2 },
//   { name: "Notifications", icon: Bell },
//   { name: "Platform Settings", icon: Settings },
//   { name: "Logout", icon: LogOut, action: "logout" },
// ];

// export default function Admin() {
//   const [selectedMenuTab, setSelectedMenuTab] = useState(() => {
//     // Set a default value that matches the menu item names
//     return localStorage.getItem("selectedMenuTab") || "User Management";
//   });
//   const [notificationCount, setNotificationCount] = useState(0);
//   const { loggedinUser } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     localStorage.setItem("selectedMenuTab", selectedMenuTab);
//     // Also update the selectedMenu that Sidebar uses
//     localStorage.setItem("selectedMenu", selectedMenuTab);
//   }, [selectedMenuTab]);

//   const handleLogout = async () => {
//     await logoutUser(loggedinUser.user._id);
//     dispatch(setLoggedinUser(null));
//     localStorage.setItem("selectedMenuTab", "User Management");
//     localStorage.setItem("selectedMenu", "User Management");
//     navigate("/login");
//   };

//   return (
//     <>
//       <h1 className="font-bold text-orange-500 text-4xl text-center my-12">
//         Admin Dashboard
//       </h1>
//       <div className="w-full mx-auto flex gap-10">
//         <div className="h-[400px] flex items-center justify-center sticky top-[12%]">
//           <Sidebar
//             role="Admin"
//             headerTitle="Admin"
//             menuItems={adminMenuItems}
//             onSelect={(menu) => {
//               if (menu === "Logout") {
//                 handleLogout();
//               } else {
//                 setSelectedMenuTab(menu);
//               }
//             }}
//             className="w-6/12"
//             notificationCount={notificationCount}
//           />
//         </div>

//         <main className="flex-1 flex flex-col gap-8 h-full overflow-y-auto no-scrollbar pr-2">
//           {selectedMenuTab === "User Management" && <UserManagement />}
//           {selectedMenuTab === "Course Management" && <CourseManagement />}
//           {selectedMenuTab === "Class Management" && <ClassManagement />}
//           {selectedMenuTab === "Payment Management" && <PaymentManagement />}
//           {selectedMenuTab === "Analytics" && <Analytics />}
//           {selectedMenuTab === "Notifications" && (
//             <Notifications setNotificationCount={setNotificationCount} />
//           )}
//           {selectedMenuTab === "Platform Settings" && <PlatformSettings />}
//         </main>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/instructorDashbord/Dashboard/Sidebar";
import {
  Users,
  BookOpen,
  CreditCard,
  BarChart2,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";

import Notifications from "@/components/admin/Notifications";
import UserManagement from "@/components/admin/UserManagement";
import CourseManagement from "@/components/admin/CourseManagement";
import PaymentManagement from "@/components/admin/PaymentManagement";
import Analytics from "@/components/admin/Analytics";
import PlatformSettings from "@/components/admin/PlatformSettings";
import ClassManagement from "@/components/admin/ClassManagement";
import { logoutUser } from "@/services/authService";
import { setLoggedinUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/components/layout/DefaultLayout";

const adminMenuItems = [
  { name: "User Management", icon: Users },
  { name: "Course Management", icon: BookOpen },
  { name: "Class Management", icon: BookOpen },
  { name: "Payment Management", icon: CreditCard },
  { name: "Analytics", icon: BarChart2 },
  { name: "Notifications", icon: Bell },
  { name: "Platform Settings", icon: Settings },
];

export default function Admin() {
  const [selectedMenuTab, setSelectedMenuTab] = useState(() => {
    return localStorage.getItem("selectedMenuTab") || "User Management";
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const { loggedinUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [adminNavOpen, setAdminNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedMenuTab", selectedMenuTab);
    localStorage.setItem("selectedMenu", selectedMenuTab);
  }, [selectedMenuTab]);

  useEffect(() => {
    if (!adminNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [adminNavOpen]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logoutUser(loggedinUser.token, loggedinUser.user._id);
      dispatch(setLoggedinUser(null));
      localStorage.setItem("selectedMenuTab", "User Management");
      localStorage.setItem("selectedMenu", "Dashboard");
      toast({
        title: "Logged out",
        description: "You have successfully logged out",
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error.message || "Logout failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="my-5 flex items-center justify-between gap-3 sm:my-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm lg:hidden"
            onClick={() => setAdminNavOpen(true)}
            aria-expanded={adminNavOpen}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
          <h1 className="font-bold text-orange-500 text-2xl sm:text-3xl md:text-4xl text-center">
            Admin Dashboard
          </h1>
          <div className="w-auto">
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="bg-red-500 hover:bg-red-600 w-auto"
            >
              {logoutLoading ? "Logging Out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      {adminNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setAdminNavOpen(false)}
        />
      )}

      <div className="w-full mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 pb-6">
        <aside
          className={`
            fixed lg:static z-50 lg:z-0
            left-0 top-14 sm:top-16 bottom-0 lg:top-auto lg:bottom-auto
            w-[min(88vw,300px)] lg:w-auto lg:min-w-[240px]
            transform transition-transform duration-200 ease-out
            ${adminNavOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            lg:sticky lg:top-28 lg:self-start
            max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] lg:max-h-[calc(100vh-6rem)] overflow-y-auto
            bg-enterprise-navy p-2 sm:p-3 lg:rounded-r-2xl
          `}
        >
          <div className="flex shrink-0 justify-end rounded-t-lg border-b border-white/10 bg-enterprise-navy p-2 lg:hidden">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
              onClick={() => setAdminNavOpen(false)}
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex w-full items-center justify-center rounded-2xl bg-enterprise-navy p-3 shadow-lg lg:w-auto lg:justify-start">
            <Sidebar
              role="Admin"
              headerTitle="Admin"
              menuItems={adminMenuItems}
              onSelect={(menu) => {
                setSelectedMenuTab(menu);
                setAdminNavOpen(false);
              }}
              className="w-full lg:w-auto"
              notificationCount={notificationCount}
            />
          </div>
        </aside>

        {/* Admin tab content (not a second <main> — DefaultLayout already provides one) */}
        <div className="w-full flex-1 flex flex-col gap-6 lg:gap-8 overflow-x-hidden">
          {selectedMenuTab === "User Management" && <UserManagement />}
          {selectedMenuTab === "Course Management" && <CourseManagement />}
          {selectedMenuTab === "Class Management" && <ClassManagement />}
          {selectedMenuTab === "Payment Management" && <PaymentManagement />}
          {selectedMenuTab === "Analytics" && <Analytics />}
          {selectedMenuTab === "Notifications" && (
            <Notifications setNotificationCount={setNotificationCount} />
          )}
          {selectedMenuTab === "Platform Settings" && <PlatformSettings />}
        </div>
      </div>
    </DefaultLayout>
  );
}
