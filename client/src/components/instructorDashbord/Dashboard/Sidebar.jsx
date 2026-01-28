import React, { useState, useEffect } from "react";
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
    <Card className="h-fit bg-white p-4 border-r-2 border-t-2 border-b-2 rounded-lg">
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
          <img
            src={user.profileImage}
            alt=""
            className="w-20 h-20 rounded-full"
          />
          <p className="text-sm font-bold text-orange-500">{user.name}</p>
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
