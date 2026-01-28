import axios from "axios";
import { getZoomAccessToken } from "../../config/zoom.js";
import Subject from "../../models/Subjects.js";
import Class from "../../models/Class.js";

// Helper function to get the next session date
const getNextSessionDate = (dayOfWeek) => {
  const daysMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = daysMap[dayOfWeek];

  let daysToAdd = targetDay - todayDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to next week's session
  }

  const nextSessionDate = new Date();
  nextSessionDate.setDate(today.getDate() + daysToAdd);
  return nextSessionDate;
};

// Function to calculate session duration
const calculateDuration = (startTime, endTime) => {
  // Add validation to check if startTime and endTime are valid
  if (!startTime || !endTime) {
    console.error("Invalid time values:", { startTime, endTime });
    return 60; // Default to 60 minutes if time values are missing
  }

  try {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1); // Adjust if endTime is past midnight
    }

    return (endDate - startDate) / (1000 * 60); // Convert to minutes
  } catch (error) {
    console.error("Error calculating duration:", error);
    return 60; // Default to 60 minutes on error
  }
};

// Function to create a Zoom meeting
const createZoomMeeting = async (topic, startTime, duration) => {
  const accessToken = await getZoomAccessToken();

  const meetingConfig = {
    topic,
    type: 2,
    start_time: startTime.toISOString(),
    duration,
    timezone: "UTC",
    agenda: topic,
    settings: {
      host_video: true,
      participant_video: true,
      mute_upon_entry: true,
      join_before_host: false,
    },
  };

  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingConfig,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.join_url;
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error
    );
    throw error;
  }
};

// Function to remove expired live sessions
const removeExpiredSessions = async (classId) => {
  try {
    const classData = await Class.findById(classId);
    if (!classData) throw new Error("Class not found");

    const now = new Date();
    classData.liveSessions = classData.liveSessions.filter((session) => {
      const [endHour, endMinute] = session.endTime.split(":").map(Number);
      const sessionEndDate = new Date();
      sessionEndDate.setHours(endHour, endMinute, 0, 0);

      return sessionEndDate > now; // Keep only active sessions
    });

    await classData.save();
  } catch (error) {
    console.error("Error removing expired sessions:", error);
  }
};

// **Controller Function**
export const scheduleLiveSessionController = async (req, res) => {
  try {
    let { classId, subjectId } = req.params; // Or use req.body

    if (!classId || !subjectId) {
      return res
        .status(400)
        .json({ error: "classId and subjectId are required" });
    }

    // Clean the IDs by removing any whitespace or newline characters
    classId = classId.trim();
    subjectId = subjectId.trim();

    // Remove expired sessions before scheduling new ones
    await removeExpiredSessions(classId);

    // Find the subject
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    // Find the next session from subject's liveSchedules
    if (!subject.liveSchedules || subject.liveSchedules.length === 0) {
      return res
        .status(400)
        .json({ error: "No live schedules found for this subject" });
    }

    const nextSchedule = subject.liveSchedules.reduce((closest, schedule) => {
      const sessionDate = getNextSessionDate(schedule.dayOfWeek);
      if (!closest || sessionDate < closest.date) {
        return {
          ...schedule.toObject(), // Convert Mongoose document to plain object
          date: sessionDate,
        };
      }
      return closest;
    }, null);

    if (!nextSchedule)
      return res
        .status(400)
        .json({ error: "Could not determine next session" });

    // Log the nextSchedule object to debug
    console.log("Next schedule:", nextSchedule);

    // Validate that startTime and endTime exist
    if (!nextSchedule.startTime || !nextSchedule.endTime) {
      return res
        .status(400)
        .json({ error: "Invalid schedule: missing start or end time" });
    }

    const { startTime, endTime, date } = nextSchedule;

    // Validate that date exists
    if (!date) {
      return res.status(400).json({ error: "Invalid schedule: missing date" });
    }

    const meetingStartTime = new Date(
      `${date.toISOString().split("T")[0]}T${startTime}Z`
    );

    // Calculate session duration
    const duration = calculateDuration(startTime, endTime);

    // Create Zoom meeting
    const meetingUrl = await createZoomMeeting(
      `${subject.name} Live Session`,
      meetingStartTime,
      duration
    );

    // Find the class
    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ error: "Class not found" });

    // Push to liveSessions
    classData.liveSessions.push({
      instructor: subject.instructor,
      subject: subject._id,
      startTime,
      endTime,
      meetingUrl,
    });

    await classData.save();

    return res.status(200).json({
      message: "Live session scheduled successfully",
      meetingUrl,
    });
  } catch (error) {
    console.error("Error scheduling live session:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
