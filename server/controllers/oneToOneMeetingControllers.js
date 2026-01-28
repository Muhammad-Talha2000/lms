// import { getZoomAccessToken } from "../config/zoom.js";
// import Course from "../models/Courses.js";
// import Student from "../models/auth/Student.js"; // Import Student model

// // Function to clear expired One-to-One sessions
// const clearExpiredOneToOneSession = async (course) => {
//   if (course.liveSession?.isActive) {
//     const sessionEndTime = new Date(course.liveSession.startTime);
//     sessionEndTime.setMinutes(
//       sessionEndTime.getMinutes() + course.liveSession.duration
//     );
//     if (sessionEndTime < new Date()) {
//       // Optionally, update the corresponding one-to-one slot to mark it as not booked
//       if (course.liveSession.bookingReference) {
//         course.oneToOneSchedules.forEach((schedule) => {
//           schedule.schedules.forEach((slot) => {
//             if (
//               slot._id.toString() ===
//               course.liveSession.bookingReference.toString()
//             ) {
//               slot.isBooked = false;
//               slot.studentId = null;
//             }
//           });
//         });
//       }
//       // Clear liveSession fields including bookingReference
//       course.liveSession = {
//         meetingLink: null,
//         meetingId: null,
//         startTime: null,
//         duration: null,
//         topic: null,
//         isActive: false,
//         bookingReference: null,
//       };
//       await course.save();
//     }
//   }
// };

// // Function to find all upcoming booked sessions and return them sorted by slot order
// const findAllUpcomingSessions = (course) => {
//   const now = new Date();
//   const upcomingSessions = [];

//   // Get all booked slots
//   for (const schedule of course.oneToOneSchedules) {
//     for (const slot of schedule.schedules) {
//       if (slot.isBooked && slot.studentId) {
//         // For each day in the schedule, compute the potential date for the slot
//         for (const dayOfWeek of schedule.daysOfWeek) {
//           const sessionDate = new Date(now);
//           let daysToAdd = (dayOfWeek - now.getDay() + 7) % 7;
//           sessionDate.setDate(now.getDate() + daysToAdd);

//           // Set the start time for this slot
//           const [slotStartHours, slotStartMinutes] = slot.startTime
//             .split(":")
//             .map(Number);
//           sessionDate.setHours(slotStartHours, slotStartMinutes, 0, 0);

//           // Create a date object representing the slot's end time on that day
//           const [slotEndHours, slotEndMinutes] = slot.endTime
//             .split(":")
//             .map(Number);
//           const slotEndDate = new Date(sessionDate);
//           slotEndDate.setHours(slotEndHours, slotEndMinutes, 0, 0);

//           // If the slot is for today but its session has already ended,
//           // then schedule for the next week on that same day.
//           if (daysToAdd === 0 && now >= slotEndDate) {
//             sessionDate.setDate(sessionDate.getDate() + 7);
//           }

//           // Only consider sessionDate if it's in the future
//           if (sessionDate > now) {
//             upcomingSessions.push({
//               date: sessionDate,
//               slot,
//               studentId: slot.studentId,
//               slotIndex: schedule.schedules.indexOf(slot) + 1, // Adding slot index for priority
//               dayIndex: schedule.daysOfWeek.indexOf(dayOfWeek) + 1, // Adding day index for priority
//             });
//           }
//         }
//       }
//     }
//   }

//   // Sort by slotIndex first (prioritize first slots), then by date
//   return upcomingSessions.sort((a, b) => {
//     if (a.slotIndex !== b.slotIndex) {
//       return a.slotIndex - b.slotIndex; // Priority based on slot order
//     }
//     if (a.dayIndex !== b.dayIndex) {
//       return a.dayIndex - b.dayIndex; // Then by day of week order
//     }
//     return a.date - b.date; // Then by date if slots are the same
//   });
// };

// export const scheduleOneToOneMeeting = async (course) => {
//   try {
//     if (!course.oneToOneSchedules?.length) return null;

//     // Always clear expired sessions
//     await clearExpiredOneToOneSession(course);

//     // Get all upcoming sessions sorted by priority (slot order first, then date)
//     const upcomingSessions = findAllUpcomingSessions(course);
//     if (!upcomingSessions.length) return null;

//     // Get the highest priority session (first slot first)
//     const highestPrioritySession = upcomingSessions[0];

//     // Check if we already have an active session
//     if (course.liveSession?.isActive) {
//       // If the active session is not the highest priority, cancel it and reschedule
//       if (
//         course.liveSession.bookingReference?.toString() !==
//         highestPrioritySession.slot._id.toString()
//       ) {
//         console.log(
//           "Cancelling existing session to schedule a higher priority session"
//         );
//         // Clear the current session to reschedule for the higher priority slot
//         course.liveSession = {
//           meetingLink: null,
//           meetingId: null,
//           startTime: null,
//           duration: null,
//           topic: null,
//           isActive: false,
//           bookingReference: null,
//         };
//         await course.save();
//       } else {
//         // The current scheduled session is already the highest priority
//         return course.liveSession;
//       }
//     }

//     // Calculate the session duration for the selected slot
//     const [startHours, startMinutes] = highestPrioritySession.slot.startTime
//       .split(":")
//       .map(Number);
//     const [endHours, endMinutes] = highestPrioritySession.slot.endTime
//       .split(":")
//       .map(Number);
//     let duration =
//       endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

//     if (duration <= 0) {
//       console.error("Invalid session duration calculated:", duration);
//       return null;
//     }

//     console.log(
//       `Scheduling session for ${duration} minutes for slot ${highestPrioritySession.slotIndex}`
//     );

//     const token = await getZoomAccessToken();
//     const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         topic: `${course.name} - One-to-One Session`,
//         type: 2,
//         start_time: highestPrioritySession.date.toISOString(),
//         duration: duration,
//         settings: {
//           host_video: true,
//           participant_video: true,
//           join_before_host: false,
//           waiting_room: true,
//         },
//       }),
//     });

//     const meetingData = await response.json();
//     if (!response.ok) throw new Error(meetingData.message);

//     // Fetch student details for the session topic
//     const student = await Student.findById(highestPrioritySession.studentId);

//     // Update liveSession with bookingReference set to the booked slot's _id
//     course.liveSession = {
//       meetingId: meetingData.id,
//       meetingLink: meetingData.join_url,
//       startTime: highestPrioritySession.date,
//       duration: duration,
//       topic: `One-to-One Session with ${student?.name || "Student"}`,
//       isActive: true,
//       bookingReference: highestPrioritySession.slot._id,
//     };

//     await course.save();
//     return course.liveSession;
//   } catch (error) {
//     console.error("Error scheduling One-to-One meeting:", error);
//     throw error;
//   }
// };

// export const getOneToOneMeetings = async (req, res) => {
//   try {
//     const courses = await Course.find({
//       instructor: req.user.id,
//       courseType: "One-to-One",
//     });
//     const scheduledMeetings = [];

//     for (const course of courses) {
//       await clearExpiredOneToOneSession(course);
//       // Always try to schedule the highest priority meeting
//       await scheduleOneToOneMeeting(course);

//       if (course.liveSession?.isActive) {
//         scheduledMeetings.push({
//           courseId: course._id,
//           courseName: course.name,
//           meetingId: course.liveSession.meetingId,
//           meetingLink: course.liveSession.meetingLink,
//           startTime: course.liveSession.startTime,
//           duration: course.liveSession.duration,
//           topic: course.liveSession.topic,
//           bookingReference: course.liveSession.bookingReference,
//         });
//       }
//     }

//     res.json(scheduledMeetings);
//   } catch (error) {
//     console.error("Error fetching One-to-One meetings:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

import { getGoogleCalendar } from "../config/googleAuth.js";
import Course from "../models/Courses.js";
import Student from "../models/auth/Student.js";

const clearExpiredOneToOneSession = async (course) => {
  if (course.liveSession?.isActive) {
    const sessionEndTime = new Date(course.liveSession.startTime);
    sessionEndTime.setMinutes(
      sessionEndTime.getMinutes() + course.liveSession.duration
    );
    if (sessionEndTime < new Date()) {
      if (course.liveSession.bookingReference) {
        course.oneToOneSchedules.forEach((schedule) => {
          schedule.schedules.forEach((slot) => {
            if (
              slot._id.toString() ===
              course.liveSession.bookingReference.toString()
            ) {
              slot.isBooked = false;
              slot.studentId = null;
            }
          });
        });
      }

      // Delete the calendar event if it exists
      if (course.liveSession.meetingId) {
        try {
          const calendar = await getGoogleCalendar();
          await calendar.events.delete({
            calendarId: "primary",
            eventId: course.liveSession.meetingId,
          });
          console.log(
            `Successfully deleted expired meeting (ID: ${course.liveSession.meetingId})`
          );
        } catch (error) {
          console.warn(
            `Failed to delete expired meeting (ID: ${course.liveSession.meetingId})`,
            error.message
          );
        }
      }

      course.liveSession = {
        meetingLink: null,
        meetingId: null,
        startTime: null,
        duration: null,
        topic: null,
        isActive: false,
        bookingReference: null,
      };
      await course.save();
    }
  }
};

const findAllUpcomingSessions = (course) => {
  const now = new Date();
  const upcomingSessions = [];

  // If there's an active session, check if it has ended
  if (course.liveSession?.isActive) {
    const sessionEndTime = new Date(course.liveSession.startTime);
    sessionEndTime.setMinutes(
      sessionEndTime.getMinutes() + course.liveSession.duration
    );

    // If the current session hasn't ended yet, only return sessions that start earlier
    // This allows higher priority (earlier) sessions to replace current ones
    // but prevents scheduling the next session until current one ends
    if (sessionEndTime > now) {
      for (const schedule of course.oneToOneSchedules) {
        for (const slot of schedule.schedules) {
          if (slot.isBooked && slot.studentId) {
            // Skip the slot that's already active
            if (
              course.liveSession.bookingReference?.toString() ===
              slot._id.toString()
            ) {
              continue;
            }

            for (const dayOfWeek of schedule.daysOfWeek) {
              const sessionDate = new Date(now);
              let daysToAdd = (dayOfWeek - now.getDay() + 7) % 7;
              sessionDate.setDate(now.getDate() + daysToAdd);
              const [slotStartHours, slotStartMinutes] = slot.startTime
                .split(":")
                .map(Number);
              sessionDate.setHours(slotStartHours, slotStartMinutes, 0, 0);

              // Only include sessions that start before the current session ends
              // (higher priority replacements)
              if (sessionDate > now && sessionDate < sessionEndTime) {
                upcomingSessions.push({
                  date: sessionDate,
                  slot,
                  studentId: slot.studentId,
                });
              }
            }
          }
        }
      }

      // If we found sessions that should replace the current one, return them
      if (upcomingSessions.length > 0) {
        return upcomingSessions.sort((a, b) => a.date - b.date);
      }

      // Otherwise, return empty array - don't schedule anything new yet
      return [];
    }
  }

  // If no active session or current session has ended, find all upcoming sessions
  for (const schedule of course.oneToOneSchedules) {
    for (const slot of schedule.schedules) {
      if (slot.isBooked && slot.studentId) {
        for (const dayOfWeek of schedule.daysOfWeek) {
          const sessionDate = new Date(now);
          let daysToAdd = (dayOfWeek - now.getDay() + 7) % 7;
          sessionDate.setDate(now.getDate() + daysToAdd);
          const [slotStartHours, slotStartMinutes] = slot.startTime
            .split(":")
            .map(Number);
          sessionDate.setHours(slotStartHours, slotStartMinutes, 0, 0);
          if (sessionDate > now) {
            upcomingSessions.push({
              date: sessionDate,
              slot,
              studentId: slot.studentId,
            });
          }
        }
      }
    }
  }
  return upcomingSessions.sort((a, b) => a.date - b.date);
};

export const scheduleOneToOneMeeting = async (course) => {
  try {
    await course.populate("instructor");

    if (!course.instructor || !course.instructor.email) {
      console.error(
        "Error: Instructor email is missing for course:",
        course.name
      );
      return;
    }

    if (!course.oneToOneSchedules?.length) return null;
    await clearExpiredOneToOneSession(course);
    const upcomingSessions = findAllUpcomingSessions(course);
    if (!upcomingSessions.length) return null;
    const highestPrioritySession = upcomingSessions[0];

    if (course.liveSession?.isActive) {
      // If the upcoming session is for a different slot or higher priority (earlier time)
      if (
        course.liveSession.bookingReference?.toString() !==
        highestPrioritySession.slot._id.toString()
      ) {
        // Delete the existing calendar event
        const calendar = await getGoogleCalendar();
        if (course.liveSession.meetingId) {
          try {
            await calendar.events.delete({
              calendarId: "primary",
              eventId: course.liveSession.meetingId,
            });
            console.log(
              `Successfully deleted meeting for replaced slot (ID: ${course.liveSession.meetingId})`
            );
          } catch (deleteError) {
            console.warn(
              `Failed to delete meeting for replaced slot (ID: ${course.liveSession.meetingId})`,
              deleteError.message
            );
          }
        }

        // Reset the live session
        course.liveSession = {
          meetingLink: null,
          meetingId: null,
          startTime: null,
          duration: null,
          topic: null,
          isActive: false,
          bookingReference: null,
        };
        await course.save();
      } else {
        // No changes needed, return the current session
        return course.liveSession;
      }
    }

    const duration =
      parseInt(highestPrioritySession.slot.endTime.split(":")[0], 10) * 60 +
      parseInt(highestPrioritySession.slot.endTime.split(":")[1], 10) -
      (parseInt(highestPrioritySession.slot.startTime.split(":")[0], 10) * 60 +
        parseInt(highestPrioritySession.slot.startTime.split(":")[1], 10));

    if (duration <= 0) return null;

    const calendar = await getGoogleCalendar();
    const student = await Student.findById(highestPrioritySession.studentId);

    // Safety check: delete previous calendar event if it exists
    if (course.liveSession?.meetingId) {
      try {
        await calendar.events.delete({
          calendarId: "primary",
          eventId: course.liveSession.meetingId,
        });
        console.log(
          `Successfully deleted previous meeting (ID: ${course.liveSession.meetingId})`
        );
      } catch (deleteError) {
        console.warn(
          `Failed to delete previous meeting (ID: ${course.liveSession.meetingId})`,
          deleteError.message
        );
      }
    }

    const event = {
      summary: `One-to-One Session with ${student?.name || "Student"}`,
      start: {
        dateTime: highestPrioritySession.date.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(
          highestPrioritySession.date.getTime() + duration * 60000
        ).toISOString(),
        timeZone: "UTC",
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${course._id}-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
          conferenceDataVersion: 1,
        },
      },
      attendees: [
        { email: course?.instructor?.email },
        // Optional: Add student email if available
        ...(student?.email ? [{ email: student.email }] : []),
      ],
    };

    const createdEvent = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
      conferenceDataVersion: 1,
    });

    if (!createdEvent?.data?.hangoutLink)
      throw new Error("Failed to create Google Meet link");

    course.liveSession = {
      meetingId: createdEvent.data.id,
      meetingLink: createdEvent.data.hangoutLink,
      startTime: highestPrioritySession.date,
      duration: duration,
      topic: `One-to-One Session with ${student?.name || "Student"}`,
      isActive: true,
      bookingReference: highestPrioritySession.slot._id,
    };

    await course.save();
    return course.liveSession;
  } catch (error) {
    console.error("Error scheduling One-to-One meeting:", error);
    throw error;
  }
};

export const getOneToOneMeetings = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
      courseType: "One-to-One",
    });
    const scheduledMeetings = [];

    for (const course of courses) {
      await clearExpiredOneToOneSession(course);
      await scheduleOneToOneMeeting(course);
      if (course.liveSession?.isActive) {
        scheduledMeetings.push({
          courseId: course._id,
          courseName: course.name,
          meetingId: course.liveSession.meetingId,
          meetingLink: course.liveSession.meetingLink,
          startTime: course.liveSession.startTime,
          duration: course.liveSession.duration,
          topic: course.liveSession.topic,
          bookingReference: course.liveSession.bookingReference,
        });
      }
    }

    res.json(scheduledMeetings);
  } catch (error) {
    console.error("Error fetching One-to-One meetings:", error);
    res.status(500).json({ error: error.message });
  }
};
