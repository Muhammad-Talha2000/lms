// import { getZoomAccessToken } from "../config/zoom.js";
// import Course from "../models/Courses.js";

// // Updated helper function to get the next occurrence of a scheduled day
// const getNextScheduledDay = (
//   currentDate,
//   scheduledDays,
//   startDate,
//   endDate
// ) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   // Use the later of currentDate and startDate as the reference
//   let referenceDate = currentDate < start ? start : currentDate;
//   const referenceDay = referenceDate.getDay();

//   // Compute the number of days until each scheduled day (relative to referenceDay)
//   const candidates = scheduledDays.map((day) => {
//     let delta = day - referenceDay;
//     if (delta < 0) delta += 7; // wrap around to next week
//     return { day, delta };
//   });

//   // Sort candidates by the smallest delta
//   candidates.sort((a, b) => a.delta - b.delta);

//   // The candidate with the smallest delta is the next scheduled day
//   const bestCandidate = candidates[0];
//   if (bestCandidate === undefined) return null;

//   const nextDate = new Date(referenceDate);
//   nextDate.setDate(referenceDate.getDate() + bestCandidate.delta);

//   // Ensure the calculated date is within the course period
//   if (nextDate >= start && nextDate <= end) {
//     return nextDate;
//   }
//   return null;
// };

// // Function to check and clear expired sessions
// export const clearExpiredSessions = async (course) => {
//   if (course.liveSession && course.liveSession.isActive) {
//     const sessionEndTime = new Date(course.liveSession.startTime);
//     sessionEndTime.setMinutes(
//       sessionEndTime.getMinutes() + course.liveSession.duration
//     );
//     if (sessionEndTime < new Date()) {
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
//       // console.log(`Cleared expired session for course ${course._id}`);
//     }
//   }
// };

// // Main function to schedule the next meeting
// export const scheduleNextMeeting = async (course) => {
//   try {
//     await clearExpiredSessions(course);
//     if (course.liveSession?.isActive) return;

//     const { liveSchedule } = course;
//     const currentDate = new Date();
//     const startDate = new Date(liveSchedule.startDate);
//     const endDate = new Date(liveSchedule.endDate);
//     if (currentDate > endDate) return;

//     let nextSessionDate = getNextScheduledDay(
//       currentDate,
//       liveSchedule.daysOfWeek,
//       startDate,
//       endDate
//     );
//     if (!nextSessionDate) return;

//     const [startHour, startMinute] = liveSchedule.startTime
//       .split(":")
//       .map(Number);
//     nextSessionDate.setHours(startHour, startMinute, 0, 0);

//     if (nextSessionDate < new Date()) {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       const newSessionDate = getNextScheduledDay(
//         tomorrow,
//         liveSchedule.daysOfWeek,
//         startDate,
//         endDate
//       );
//       if (newSessionDate) {
//         nextSessionDate = newSessionDate;
//         nextSessionDate.setHours(startHour, startMinute, 0, 0);
//       }
//     }

//     const [endHour, endMinute] = liveSchedule.endTime.split(":").map(Number);
//     let duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);
//     if (duration <= 0) duration += 24 * 60;

//     const token = await getZoomAccessToken();

//     const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         topic: `${course.name} - Live Session`,
//         type: 2,
//         start_time: nextSessionDate.toISOString(),
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

//     course.liveSession = {
//       meetingId: meetingData.id,
//       meetingLink: meetingData.join_url,
//       startTime: nextSessionDate,
//       duration: duration,
//       topic: `${course.name} - Live Session`,
//       isActive: true,
//       bookingReference: null,
//     };
//     await course.save();
//     return course.liveSession;
//   } catch (error) {
//     console.error("Error scheduling meeting:", error);
//     throw error;
//   }
// };

// // Controller to get scheduled meetings for courses
// export const getScheduledMeetings = async (req, res) => {
//   try {
//     const courses = await Course.find({
//       instructor: req.user.id,
//       courseType: "Live",
//     });
//     const scheduledMeetings = [];
//     for (const course of courses) {
//       try {
//         await clearExpiredSessions(course);
//         if (!course.liveSession?.isActive) {
//           await scheduleNextMeeting(course);
//         }
//         if (course.liveSession?.isActive) {
//           scheduledMeetings.push({
//             courseId: course._id,
//             courseName: course.name,
//             meetingId: course.liveSession.meetingId,
//             meetingLink: course.liveSession.meetingLink,
//             startTime: course.liveSession.startTime,
//             duration: course.liveSession.duration,
//             topic: course.liveSession.topic,
//           });
//         }
//       } catch (courseError) {
//         console.error(
//           `Error scheduling meeting for course ${course._id}:`,
//           courseError
//         );
//       }
//     }
//     res.json(scheduledMeetings);
//   } catch (error) {
//     console.error("Error fetching scheduled meetings:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // -----------
// // Background Job to Clear Expired Sessions Automatically
// // -----------

// // This background job will run every minute and clear any expired sessions without waiting for a host refresh.
// setInterval(async () => {
//   try {
//     const courses = await Course.find({ "liveSession.isActive": true });
//     for (const course of courses) {
//       await clearExpiredSessions(course);
//     }
//   } catch (error) {
//     console.error("Error in background session clearance:", error);
//   }
// }, 60000); // 60000ms = 1 minute

import { getGoogleCalendar } from "../config/googleAuth.js";
import Course from "../models/Courses.js";

// // Updated helper function to get the next occurrence of a scheduled day
const getNextScheduledDay = (
  currentDate,
  scheduledDays,
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Use the later of currentDate and startDate as the reference
  let referenceDate = currentDate < start ? start : currentDate;
  const referenceDay = referenceDate.getDay();

  // Compute the number of days until each scheduled day (relative to referenceDay)
  const candidates = scheduledDays.map((day) => {
    let delta = day - referenceDay;
    if (delta < 0) delta += 7; // wrap around to next week
    return { day, delta };
  });

  // Sort candidates by the smallest delta
  candidates.sort((a, b) => a.delta - b.delta);

  // The candidate with the smallest delta is the next scheduled day
  const bestCandidate = candidates[0];
  if (bestCandidate === undefined) return null;

  const nextDate = new Date(referenceDate);
  nextDate.setDate(referenceDate.getDate() + bestCandidate.delta);

  // Ensure the calculated date is within the course period
  if (nextDate >= start && nextDate <= end) {
    return nextDate;
  }
  return null;
};

// Function to clear expired Google Meet sessions
export const clearExpiredSessions = async (course) => {
  if (course.liveSession && course.liveSession.isActive) {
    const sessionEndTime = new Date(course.liveSession.startTime);
    sessionEndTime.setMinutes(
      sessionEndTime.getMinutes() + course.liveSession.duration
    );

    if (sessionEndTime < new Date()) {
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

// Fixed function to correctly calculate duration in minutes
const calculateDurationInMinutes = (startTime, endTime) => {
  // Parse hours and minutes
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Calculate total minutes
  let startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  // Handle case where end time is on the next day
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // Add 24 hours in minutes
  }

  return endTotalMinutes - startTotalMinutes;
};

// Main function to schedule the next Google Meet session
// export const scheduleNextMeeting = async (course) => {
//   try {
//     const calendar = await getGoogleCalendar();

//     await clearExpiredSessions(course);
//     if (course.liveSession?.isActive) return;

//     await course.populate("instructor");

//     if (!course.instructor || !course.instructor.email) {
//       console.error(
//         "Error: Instructor email is missing for course:",
//         course.name
//       );
//       return;
//     }

//     // Get the next valid session date based on schedule
//     const nextSessionDate = getNextScheduledDay(
//       new Date(),
//       course.liveSchedule.daysOfWeek,
//       new Date(course.liveSchedule.startDate),
//       new Date(course.liveSchedule.endDate)
//     );
//     if (!nextSessionDate) return;

//     const [startHour, startMinute] = course.liveSchedule.startTime
//       .split(":")
//       .map(Number);
//     nextSessionDate.setHours(startHour, startMinute, 0, 0);

//     // Fix duration calculation
//     const duration = calculateDurationInMinutes(
//       course.liveSchedule.startTime,
//       course.liveSchedule.endTime
//     );

//     const endDateTime = new Date(nextSessionDate);
//     endDateTime.setMinutes(nextSessionDate.getMinutes() + duration);

//     // Add instructor as a co-organizer with specific role
//     const attendees = [
//       {
//         email: course.instructor.email,
//         responseStatus: "accepted",
//         // Use optional attendee properties to help with host rights
//         organizer: true,
//       },
//     ];

//     const event = {
//       summary: `${course.name} - Live Session`,
//       description: `Course: ${course.name}\nInstructor: ${course.instructor.email}\n\nThis meeting has been automatically scheduled. The instructor has host privileges.`,
//       start: { dateTime: nextSessionDate.toISOString(), timeZone: "UTC" },
//       end: { dateTime: endDateTime.toISOString(), timeZone: "UTC" },
//       conferenceData: {
//         createRequest: {
//           requestId: `meet-${course._id}-${Date.now()}`,
//           conferenceSolutionKey: { type: "hangoutsMeet" },
//           // Add conference data version and settings
//           // This configuration addresses the "joining before host" issue
//           conferenceDataVersion: 1,
//         },
//         coHost: [
//           {
//             email: course.instructor.email,
//             role: "CO_HOST",
//           },
//         ],
//       },
//       attendees: attendees,
//       // Explicitly set the admin as organizer but grant host controls to instructor
//       // through the Google Meet settings below
//       organizer: { email: process.env.ADMIN_EMAIL },
//       // Prevent external guests from joining
//       guestsCanInviteOthers: false,
//       // Make sure guests can see other guests
//       guestsCanSeeOtherGuests: true,
//       // Prevent modification by guests
//       guestsCanModify: false,
//       // Add specific Google Meet settings to prevent joining before host
//       // These are the enterprise settings that require Google Workspace
//       extendedProperties: {
//         private: {
//           "hangoutsMeet.hostPermissions": course.instructor.email, // Assign host rights to the instructor
//           "hangoutsMeet.allowExternalParticipants": "true", // Allow external participants if necessary
//           "hangoutsMeet.allowAnonymousParticipants": "false", // Prevent anonymous users
//           "hangoutsMeet.lockSettingsForParticipants": "true", // Lock meeting settings for participants
//           "hangoutsMeet.allowJoiningBeforeHost": "false", // Prevent joining before the host
//           "hangoutsMeet.hostCanAdmitParticipants": "true", // Allow host to admit participants
//           "hangoutsMeet.hostCanMuteParticipants": "true", // Allow host to mute participants
//           "hangoutsMeet.hostCanRemoveParticipants": "true", // Allow host to remove participants
//           "hangoutsMeet.hostCanEndMeeting": "true", // Allow host to end the meeting
//           "hangoutsMeet.hostCanCreatePoll": "true", // Allow host to create polls
//         },
//       },
//     };

//     const createdEvent = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//       sendUpdates: "all",
//       // Make sure conference data version is set to 1 for advanced settings
//       conferenceDataVersion: 1,
//     });

//     // Check if Google Meet link was created
//     if (!createdEvent?.data?.hangoutLink) {
//       throw new Error("Failed to create Google Meet link");
//     }

//     course.liveSession = {
//       meetingId: createdEvent.data.id,
//       meetingLink: createdEvent.data.hangoutLink,
//       startTime: nextSessionDate,
//       duration: duration,
//       topic: `${course.name} - Live Session`,
//       isActive: true,
//       bookingReference: null,
//     };

//     await course.save();

//     // Log success
//     console.log(
//       `Meeting scheduled for course ${course.name}. Duration: ${duration} minutes`
//     );

//     return course.liveSession;
//   } catch (error) {
//     // console.error("Error scheduling Google Meet:", error);
//     throw error;
//   }
// };

export const scheduleNextMeeting = async (course) => {
  try {
    await course.populate("instructor");

    if (!course.instructor || !course.instructor.email) {
      console.error(
        "Error: Instructor email is missing for course:",
        course.name
      );
      return;
    }

    // 🔹 Impersonate the instructor when creating the event
    const calendar = await getGoogleCalendar();

    await clearExpiredSessions(course);
    if (course.liveSession?.isActive) return;

    const nextSessionDate = getNextScheduledDay(
      new Date(),
      course.liveSchedule.daysOfWeek,
      new Date(course.liveSchedule.startDate),
      new Date(course.liveSchedule.endDate)
    );
    if (!nextSessionDate) return;

    const [startHour, startMinute] = course.liveSchedule.startTime
      .split(":")
      .map(Number);
    nextSessionDate.setHours(startHour, startMinute, 0, 0);

    const duration = calculateDurationInMinutes(
      course.liveSchedule.startTime,
      course.liveSchedule.endTime
    );

    const endDateTime = new Date(nextSessionDate);
    endDateTime.setMinutes(nextSessionDate.getMinutes() + duration);

    const event = {
      summary: `${course.name} - Live Session`,
      description: `Course: ${course.name}\nInstructor: ${course.instructor.email}\n\nThis meeting has been automatically scheduled.`,
      start: { dateTime: nextSessionDate.toISOString(), timeZone: "UTC" },
      end: { dateTime: endDateTime.toISOString(), timeZone: "UTC" },
      conferenceData: {
        createRequest: {
          requestId: `meet-${course._id}-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
          conferenceDataVersion: 1,
        },
      },
      attendees: [
        { email: course.instructor.email, responseStatus: "accepted" },
      ],
      organizer: { email: process.env.GOOGLE_ADMIN_EMAIL }, // 🔹 Instructor becomes the host
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
      guestsCanModify: false,
    };

    const createdEvent = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
      conferenceDataVersion: 1,
    });

    console.log(
      "Created Google Calendar Event:",
      JSON.stringify(createdEvent.data, null, 2)
    );

    if (!createdEvent?.data?.hangoutLink) {
      throw new Error("Failed to create Google Meet link");
    }

    course.liveSession = {
      meetingId: createdEvent.data.id,
      meetingLink: createdEvent.data.hangoutLink,
      startTime: nextSessionDate,
      duration: duration,
      topic: `${course.name} - Live Session`,
      isActive: true,
      bookingReference: null,
    };

    await course.save();

    console.log(
      `Meeting scheduled for course ${course.name}. Duration: ${duration} minutes`
    );

    return course.liveSession;
  } catch (error) {
    throw error;
  }
};

// Controller to get scheduled meetings for courses
export const getScheduledMeetings = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
      courseType: "Live",
    });
    const scheduledMeetings = [];
    const schedulingErrors = [];

    for (const course of courses) {
      try {
        await clearExpiredSessions(course);
        if (!course.liveSession?.isActive) {
          await scheduleNextMeeting(course);
        }
        if (course.liveSession?.isActive) {
          scheduledMeetings.push({
            courseId: course._id,
            courseName: course.name,
            meetingId: course.liveSession.meetingId,
            meetingLink: course.liveSession.meetingLink,
            startTime: course.liveSession.startTime,
            duration: course.liveSession.duration,
            topic: course.liveSession.topic,
          });
        }
      } catch (courseError) {
        console.error(
          `Error scheduling meeting for course ${course._id}:`,
          courseError
        );
        schedulingErrors.push({
          courseId: course._id.toString(),
          message: courseError?.message || "Failed to schedule meeting",
        });
      }
    }

    const hasAuthGrantError = schedulingErrors.some((err) =>
      err.message?.includes("invalid_grant")
    );

    if (scheduledMeetings.length === 0 && hasAuthGrantError) {
      return res.status(502).json({
        message:
          "Google Calendar authentication failed (invalid_grant). Reconnect Google credentials and refresh token.",
        code: "GOOGLE_AUTH_INVALID_GRANT",
      });
    }

    res.json(scheduledMeetings);
  } catch (error) {
    console.error("Error fetching scheduled meetings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Background Job to Clear Expired Sessions Automatically
// setInterval(async () => {
//   try {
//     const courses = await Course.find({ "liveSession.isActive": true });
//     for (const course of courses) {
//       await clearExpiredSessions(course);
//     }
//   } catch (error) {
//     console.error("Error in background session clearance:", error);
//   }
// }, 30000);
