// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSelector } from "react-redux";

// const LiveClassesContent = () => {
//   const [scheduledMeetings, setScheduledMeetings] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { token } = useSelector((state) => state.auth.loggedinUser);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     fetchData();
//     // Update current time every minute
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     return () => clearInterval(timer);
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const meetingsResponse = await fetch(
//         "http://localhost:5000/api/v1/zoom/scheduled-meetings",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const meetingsData = await meetingsResponse.json();
//       if (!meetingsResponse.ok) throw new Error(meetingsData.message);

//       setScheduledMeetings(meetingsData);
//     } catch (err) {
//       setError(err.message || "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isMeetingActive = (startTime) => {
//     const meetingStart = new Date(startTime);
//     const meetingEnd = new Date(meetingStart.getTime());
//     meetingEnd.setMinutes(meetingEnd.getMinutes() + 10); // 10 minutes buffer after start time

//     return currentTime >= meetingStart && currentTime <= meetingEnd;
//   };

//   const getTimeUntilMeeting = (startTime) => {
//     const meetingStart = new Date(startTime);
//     const timeLeft = meetingStart - currentTime;

//     if (timeLeft <= 0) return "";

//     const minutes = Math.floor(timeLeft / (1000 * 60));
//     const hours = Math.floor(minutes / 60);

//     if (hours > 0) {
//       return `Starts in ${hours}h ${minutes % 60}m`;
//     }
//     return `Starts in ${minutes}m`;
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Scheduled Meetings</h1>

//       {loading && <p>Loading...</p>}

//       <div className="grid gap-4">
//         {scheduledMeetings.length > 0 ? (
//           scheduledMeetings.map((meeting) => (
//             <Card key={meeting.meetingId}>
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-sm text-orange-500 font-bold">
//                       {meeting.topic}
//                     </h3>
//                     <p className="text-sm">
//                       Start Time: {new Date(meeting.startTime).toLocaleString()}
//                     </p>
//                     <p className="text-sm">
//                       Duration: {meeting.duration} minutes
//                     </p>
//                     {!isMeetingActive(meeting.startTime) && (
//                       <p className="text-sm text-blue-500 mt-1">
//                         {getTimeUntilMeeting(meeting.startTime)}
//                       </p>
//                     )}
//                   </div>
//                   <Button
//                     asChild
//                     disabled={!isMeetingActive(meeting.startTime)}
//                     className={
//                       !isMeetingActive(meeting.startTime)
//                         ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
//                         : "bg-orange-500 hover:bg-orange-600"
//                     }
//                   >
//                     <a
//                       href={meeting.meetingLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       onClick={(e) => {
//                         if (!isMeetingActive(meeting.startTime)) {
//                           e.preventDefault();
//                         }
//                       }}
//                     >
//                       Join Meeting
//                     </a>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No scheduled meetings</p>
//         )}
//       </div>

//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default LiveClassesContent;

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { API_V1_BASE } from "@/config/apiBase";

const LiveClassesContent = () => {
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth.loggedinUser);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Poll every minute to update both current time and scheduled meetings
  useEffect(() => {
    const fetchAndUpdate = () => {
      setCurrentTime(new Date());
      fetchData();
    };

    // Initial fetch of the meeting
    fetchAndUpdate();

    // const timer = setInterval(fetchAndUpdate, 30000); // every 30 seconds

    // return () => clearInterval(timer);
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const meetingsResponse = await fetch(
        `${API_V1_BASE}/zoom/scheduled-meetings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const meetingsData = await meetingsResponse.json();
      if (!meetingsResponse.ok) throw new Error(meetingsData.message);

      setScheduledMeetings(meetingsData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const isMeetingActive = (startTime) => {
    const meetingStart = new Date(startTime);
    const meetingEnd = new Date(meetingStart.getTime());
    meetingEnd.setMinutes(meetingEnd.getMinutes() + 10); // 10 minutes buffer after start time

    return currentTime >= meetingStart && currentTime <= meetingEnd;
  };

  const getTimeUntilMeeting = (startTime) => {
    const meetingStart = new Date(startTime);
    const timeLeft = meetingStart - currentTime;

    if (timeLeft <= 0) return "";

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `Starts in ${hours}h ${minutes % 60}m`;
    }
    return `Starts in ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scheduled Meetings</h1>

      {loading && <p>Loading...</p>}

      <div className="grid gap-4">
        {scheduledMeetings.length > 0 ? (
          scheduledMeetings.map((meeting) => (
            <Card key={meeting.meetingId}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-orange-500 font-bold">
                      {meeting.topic}
                    </h3>
                    <p className="text-sm">
                      Start Time: {new Date(meeting.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Duration: {meeting.duration} minutes
                    </p>
                    {!isMeetingActive(meeting.startTime) && (
                      <p className="text-sm text-blue-500 mt-1">
                        {getTimeUntilMeeting(meeting.startTime)}
                      </p>
                    )}
                  </div>
                  <Button
                    asChild
                    disabled={!isMeetingActive(meeting.startTime)}
                    className={
                      !isMeetingActive(meeting.startTime)
                        ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!isMeetingActive(meeting.startTime)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Join Meeting
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No scheduled meetings</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LiveClassesContent;
