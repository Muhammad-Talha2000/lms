import moment from "moment-timezone";

export const convertToUTC = (localTime, userTimeZone) => {
  return moment
    .tz(localTime, "YYYY-MM-DD HH:mm", userTimeZone)
    .utc()
    .toISOString();
};

export const convertToLocalTime = (utcTime, userTimeZone) => {
  return moment(utcTime).tz(userTimeZone).format("YYYY-MM-DD HH:mm");
};

export const getUserTimeZone = (req) => {
  return req.headers["timezone"] || "UTC"; // Default to UTC if not provided
};

/**
 * Convert a time from UTC to the user's local time.
 * @param {String} time - The time in HH:mm format.
 * @param {String} userTimeZone - The user's time zone.
 * @returns {String} - Converted time in HH:mm format.
 */
export const convertToUserTime = (time, userTimeZone) => {
  if (!time || !userTimeZone) return time; // Return original if missing data

  return moment.tz(time, "HH:mm", "UTC").tz(userTimeZone).format("HH:mm");
};

/**
 * Convert the course schedules to the user's local timezone.
 * @param {Object} course - The course object.
 * @param {String} userTimeZone - The user's time zone.
 */
export const convertCourseScheduleToUserTime = (course, userTimeZone) => {
  if (course.liveSchedule) {
    course.liveSchedule.startTime = convertToUserTime(
      course.liveSchedule.startTime,
      userTimeZone
    );
    course.liveSchedule.endTime = convertToUserTime(
      course.liveSchedule.endTime,
      userTimeZone
    );
  }

  if (course.oneToOneSchedules) {
    course.oneToOneSchedules.forEach((session) => {
      session.schedules.forEach((schedule) => {
        schedule.startTime = convertToUserTime(
          schedule.startTime,
          userTimeZone
        );
        schedule.endTime = convertToUserTime(schedule.endTime, userTimeZone);
      });
    });
  }
};
