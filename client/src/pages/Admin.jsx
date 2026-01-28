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

  useEffect(() => {
    localStorage.setItem("selectedMenuTab", selectedMenuTab);
    localStorage.setItem("selectedMenu", selectedMenuTab);
  }, [selectedMenuTab]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logoutUser(loggedinUser.user._id);
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
    <>
      <h1 className="font-bold text-orange-500 text-4xl text-center my-12">
        Admin Dashboard
      </h1>
      <div className="my-8 flex justify-end pr-12">
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="bg-red-500 hover:bg-red-600 "
        >
          {logoutLoading ? "Logging Out..." : "Logout"}
        </Button>
      </div>
      <div className="w-full mx-auto flex gap-10">
        {/* Sidebar and Logout Button */}
        <div className="flex flex-col items-center">
          <div className="h-[400px] flex items-center justify-center sticky top-[12%]">
            <Sidebar
              role="Admin"
              headerTitle="Admin"
              menuItems={adminMenuItems}
              onSelect={(menu) => setSelectedMenuTab(menu)}
              className="w-6/12"
              notificationCount={notificationCount}
            />
          </div>
        </div>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col gap-8 h-full overflow-y-auto no-scrollbar pr-2">
          {selectedMenuTab === "User Management" && <UserManagement />}
          {selectedMenuTab === "Course Management" && <CourseManagement />}
          {selectedMenuTab === "Class Management" && <ClassManagement />}
          {selectedMenuTab === "Payment Management" && <PaymentManagement />}
          {selectedMenuTab === "Analytics" && <Analytics />}
          {selectedMenuTab === "Notifications" && (
            <Notifications setNotificationCount={setNotificationCount} />
          )}
          {selectedMenuTab === "Platform Settings" && <PlatformSettings />}
        </main>
      </div>
    </>
  );
}
