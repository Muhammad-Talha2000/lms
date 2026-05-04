import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";



const Sidebar = ({ role, menuItems, headerTitle, onSelect, user, notificationCount  }) => {
  // Initialize activeItem from localStorage
  const [activeItem, setActiveItem] = useState(() => {
    return (
      localStorage.getItem("selectedMenu") || menuItems[0]?.name || "Dashboard"
    );
  });

  // Update activeItem when selectedMenu changes in parent
  useEffect(() => {
    const currentMenu = localStorage.getItem("selectedMenu");
    if (currentMenu) {
      setActiveItem(currentMenu);
    }
  }, []);

  return (
    <Card className="h-fit w-full min-w-0 bg-white p-4 border-r-2 border-t-2 border-b-2 rounded-lg shadow-sm lg:shadow-none">
      {/* Header */}

      {user && user.role !== "instructor" && (
        <div className="mb-8">
          <h2 className="text-orange-500 font-semibold capitalize text-lg">
            {headerTitle}
          </h2>
          <p className="text-gray-400 text-xs uppercase">{role} DASHBOARD</p>
        </div>
      )}

      {user && (
        <div className="pb-2 mb-4 border-b-2 border-gray-300 flex flex-col justifu-center items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
            <img
              src={user.profileImage ? `${user.profileImage}` : "/default-avatar.png"}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = '<div style="width:100%; height:100%; background:#f97316; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:24px;">'+user.name.charAt(0)+'</div>';
              }}
            />
          </div>
          <p className="text-sm font-bold text-orange-500">{user.name}</p>
          {user.role === "instructor" && (
            <Link
              to="/profile"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Edit profile
            </Link>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          const action = item.action;
          

          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveItem(item.name); // Update active item
                onSelect(item.name); // Update the parent component's state
              }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-50"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
              {item.name === "Notifications" && notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )} 
                            
            </button>
            
          );
        })}
      </nav>
    </Card>
  );
};

export default Sidebar;
