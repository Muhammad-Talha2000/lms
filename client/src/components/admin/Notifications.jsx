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
import { X } from "lucide-react";
import { getNotifications } from "@/services/notificationService";

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      console.log("Notifications", data)
      setNotifications(data);
      setNotificationCount(data.length);
    };

    fetchNotifications();
  }, [setNotificationCount]);

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter((notif) => notif._id !== id);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);
  };

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <CardContent className="w-full p-4 bg-white shadow-lg rounded-lg">
        <div className="flex items-center gap-4 my-4">
          <h3 className="text-lg font-semibold">Admin Notifications</h3>
          {notifications.length > 0 && (
            <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notif) => (
            <Card key={notif._id} className="mb-2 p-2 flex justify-between items-center">
              <CardContent className="text-sm">
                <strong>{notif.type}:</strong> {notif.message}
              </CardContent>
              <Button variant="ghost" size="icon" onClick={() => removeNotification(notif._id)}>
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </Card>
          ))
        )}
      </CardContent>
    </div>
  );
};

export default Notifications;
