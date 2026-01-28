import { getGoogleCalendar } from "../config/googleAuth.js";

export const getCalendarMeetings = async (req, res) => {
  try {
    const calendar = await getGoogleCalendar();
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(), // Only upcoming events
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    const formattedEvents = response.data.items.map((event) => ({
      title: event.summary,
      startTime: event.start?.dateTime || "TBD",
      endTime: event.end?.dateTime || "TBD",
      meetLink: event.hangoutLink || "N/A",
      instructor: event.attendees ? event.attendees[0]?.email : "Unknown",
    }));

    return res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching calendar events:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
