// import React, { useState, useEffect } from 'react'

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Bell, X } from "lucide-react";
// import { getCourses} from "@/services/courseService";
// import { useSelector } from "react-redux";

// const notificationsData = [
//   { id: 1, type: "Instructor", message: "John Doe submitted a new course for review." },
//   { id: 2, type: "Learner", message: "Alice sent a message regarding course enrollment." },
//   { id: 3, type: "Instructor", message: "Mark requested approval for course updates." },
//   { id: 4, type: "Learner", message: "Sam completed the assessment and requested feedback." },
//   { id: 5, type: "Instructor", message: "John Doe submitted a new course for review." },
//   { id: 6, type: "Learner", message: "Alice sent a message regarding course enrollment." },
//   { id: 7, type: "Instructor", message: "Mark requested approval for course updates." },
//   { id: 9, type: "Learner", message: "Sam completed the assessment and requested feedback." },
// ];

// const Notifications = ({ setNotificationCount }) => {
//   const [notifications, setNotifications] = useState(notificationsData);

//   useEffect(() => {
//     setNotificationCount(notifications.length);
//   }, [notifications, setNotificationCount]);

//   const removeNotification = (id) => {
//     const updatedNotifications = notifications.filter((notif) => notif.id !== id);
//     setNotifications(updatedNotifications);
//     setNotificationCount(updatedNotifications.length);
//   };

//   return (
//     <div className="w-full p-4 bg-white shadow-lg rounded-lg">
//     <div asChild className='flex  items-center'>
//     </div>
//     <CardContent className="w-full p-4 bg-white shadow-lg rounded-lg">
//       <div className="flex items-center gap-4 my-4">
//       <h3 className="text-lg font-semibold">Notifications</h3>
//       {notifications.length > 0 && (
//           <span className=" bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//             {notifications.length}
//           </span>
//         )}
//       </div>
//       {notifications.length === 0 ? (
//         <p className="text-sm text-gray-500">No new notifications</p>
//       ) : (
//         notifications.map((notif) => (
//           <Card key={notif.id} className="mb-2 p-2 flex justify-between items-center">
//             <CardContent className="text-sm">
//               <strong>{notif.type}:</strong> {notif.message}
//             </CardContent>
//             <Button variant="ghost" size="icon" onClick={() => removeNotification(notif.id)}>
//               <X className="w-4 h-4 text-gray-500" />
//             </Button>
//           </Card>
//         ))
//       )}
//     </CardContent>
//   </div>
//   )
// }

// export default Notifications
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock3, UserPlus, BookOpen, ShieldCheck, X } from "lucide-react";
import { getNotifications } from "@/services/notificationService";

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "Unknown time";
    const now = Date.now();
    const then = new Date(dateValue).getTime();
    if (Number.isNaN(then)) return "Unknown time";

    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateValue).toLocaleDateString();
  };

  const resolveTypeStyle = (type = "") => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes("registration")) {
      return {
        icon: UserPlus,
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconClass: "text-emerald-600",
      };
    }
    if (normalizedType.includes("course")) {
      return {
        icon: BookOpen,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        iconClass: "text-blue-600",
      };
    }
    if (normalizedType.includes("login")) {
      return {
        icon: ShieldCheck,
        badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
        iconClass: "text-violet-600",
      };
    }
    return {
      icon: Bell,
      badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
      iconClass: "text-orange-600",
    };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await getNotifications();
      const sortedData = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedData);
      setNotificationCount(sortedData.length);
      setLoading(false);
    };

    fetchNotifications();
  }, [setNotificationCount]);

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter((notif) => notif._id !== id);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);
  };

  return (
    <div className="w-full p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card className="border-orange-100 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide opacity-90">Total Alerts</p>
            <p className="text-3xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Latest Activity</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {notifications[0]?.type || "No activity"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Updated</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {notifications[0]?.createdAt
                ? getRelativeTime(notifications[0].createdAt)
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg sm:text-xl font-semibold">Admin Notifications</h3>
            </div>
            {notifications.length > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50">
              <Bell className="w-7 h-7 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const style = resolveTypeStyle(notif.type);
                const TypeIcon = style.icon;
                return (
                  <Card
                    key={notif._id}
                    className="border border-gray-200 hover:border-orange-200 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 min-w-0">
                          <div className="p-2 rounded-full bg-gray-50">
                            <TypeIcon className={`w-4 h-4 ${style.iconClass}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`text-xs px-2 py-0.5 border rounded-full ${style.badgeClass}`}
                              >
                                {notif.type || "Notification"}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock3 className="w-3 h-3" />
                                {getRelativeTime(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 break-words">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNotification(notif._id)}
                          className="text-gray-500 hover:text-red-500"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
