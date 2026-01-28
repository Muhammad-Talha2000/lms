// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CalendarDays, Clock } from "lucide-react";

// const ScheduleSelector = ({
//   schedules,
//   onScheduleSelect,
//   selectedSchedule,
// }) => {
//   // Group schedules by date for better organization
//   const groupSchedulesByDate = (schedules) => {
//     const grouped = {};
//     schedules.forEach((scheduleBlock) => {
//       const date = scheduleBlock.date;
//       if (!grouped[date]) {
//         grouped[date] = [];
//       }
//       scheduleBlock.schedules.forEach((schedule) => {
//         if (!schedule.studentId) {
//           // Only add available schedules
//           grouped[date].push(schedule);
//         }
//       });
//     });
//     return grouped;
//   };

//   const groupedSchedules = groupSchedulesByDate(schedules);

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <CalendarDays className="h-5 w-5" />
//           Available Time Slots
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {Object.entries(groupedSchedules).map(([date, timeSlots]) => (
//             <div key={date} className="space-y-2">
//               <div className="grid grid-cols-2 gap-2">
//                 {timeSlots.map((slot, index) => (
//                   <Button
//                     key={`${date}-${index}`}
//                     variant={
//                       selectedSchedule === slot ? "secondary" : "outline"
//                     }
//                     className={`
//                       w-full justify-start space-x-2
//                       ${
//                         selectedSchedule === slot
//                           ? "bg-orange-100 border-orange-500"
//                           : ""
//                       }
//                     `}
//                     onClick={() => onScheduleSelect(slot)}
//                   >
//                     <Clock className="h-4 w-4" />
//                     <span>
//                       {slot.startTime} - {slot.endTime}
//                     </span>
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {Object.keys(groupedSchedules).length === 0 && (
//             <div className="text-center py-4 text-gray-500">
//               No available time slots
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ScheduleSelector;

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Globe } from "lucide-react";

const ScheduleSelector = ({
  schedules,
  onScheduleSelect,
  selectedSchedule,
  instructorTimezone,
}) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const convertTimeToUserTimezone = (
    timeStr,
    instructorTimezone,
    userTimezone
  ) => {
    if (!timeStr) return "";

    try {
      // Parse the time string
      const [hours, minutes] = timeStr.split(":").map(Number);

      // Create a date string in ISO format with a fixed date (today)
      const today = new Date().toISOString().split("T")[0];
      const dateTimeString = `${today}T${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

      // Create date object in instructor timezone
      const instructorDate = new Date(dateTimeString);

      // Calculate timezone offsets
      const instructorOffset = getTimezoneOffset(
        instructorTimezone,
        instructorDate
      );
      const userOffset = getTimezoneOffset(userTimezone, instructorDate);

      // Apply timezone difference
      const correctedTime = new Date(
        instructorDate.getTime() + (instructorOffset - userOffset)
      );

      // Format for display
      return correctedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error converting time:", error);
      return timeStr;
    }
  };

  // Helper function to get timezone offset in milliseconds
  const getTimezoneOffset = (timezone, date) => {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone })
    );
    return utcDate.getTime() - tzDate.getTime();
  };

  const getAvailableTimeSlots = useMemo(() => {
    if (!Array.isArray(schedules) || schedules.length === 0) return [];

    return schedules[0].schedules
      .filter((slot) => !slot.isBooked)
      .map((slot) => ({
        ...slot,
        displayStartTime: convertTimeToUserTimezone(
          slot.startTime,
          instructorTimezone,
          userTimezone
        ),
        displayEndTime: convertTimeToUserTimezone(
          slot.endTime,
          instructorTimezone,
          userTimezone
        ),
        originalStartTime: slot.startTime,
        originalEndTime: slot.endTime,
      }));
  }, [schedules, userTimezone, instructorTimezone]); // Recompute when schedules or user timezone changes

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Available Time Slots
        </CardTitle>
        <div className="flex flex-col gap-1 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Your timezone: {userTimezone}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Instructor's timezone: {instructorTimezone}</span>
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {getAvailableTimeSlots.map((slot, index) => (
            <Button
              key={index}
              variant={
                selectedSchedule?.startTime === slot.originalStartTime &&
                selectedSchedule?.endTime === slot.originalEndTime
                  ? "secondary"
                  : "outline"
              }
              className={`w-full justify-start space-x-2 ${
                selectedSchedule?.startTime === slot.originalStartTime &&
                selectedSchedule?.endTime === slot.originalEndTime
                  ? "bg-orange-100 border-orange-500"
                  : ""
              }`}
              onClick={() =>
                onScheduleSelect({
                  startTime: slot.originalStartTime,
                  endTime: slot.originalEndTime,
                })
              }
            >
              <Clock className="h-4 w-4" />
              <span>
                {slot.displayStartTime} - {slot.displayEndTime}
              </span>
            </Button>
          ))}
          {getAvailableTimeSlots.length === 0 && (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No available time slots
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSelector;
