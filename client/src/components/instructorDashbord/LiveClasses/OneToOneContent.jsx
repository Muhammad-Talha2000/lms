import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { token } = useSelector((state) => state.auth.loggedinUser);

  // Function to fetch meetings from the server
  const fetchMeetings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/one-to-one-meetings/scheduled",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeetings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMeetings();

    // Every minute update the current time and re-fetch meetings
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      fetchMeetings();
    }, 60000);

    return () => clearInterval(timer);
  }, [token]);

  // Allow joining as soon as the meeting's start time has passed
  const isMeetingActive = (startTime) => {
    const meetingStart = new Date(startTime);
    return currentTime >= meetingStart;
  };

  const getTimeUntilMeeting = (startTime) => {
    const meetingStart = new Date(startTime);
    const timeLeft = meetingStart - currentTime;
    if (timeLeft <= 0) return "";
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    return hours > 0
      ? `Starts in ${hours}h ${minutes % 60}m`
      : `Starts in ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading scheduled meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Scheduled Meetings</h2>
      </div>

      {meetings.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center h-[200px]">
            <p className="text-gray-500">No meetings scheduled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.meetingId} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-orange-500 font-bold text-lg">
                        {meeting.courseName}
                      </h3>
                      <p className="font-semibold text-sm">{meeting.topic}</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(meeting.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(meeting.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                  </div>

                  {!isMeetingActive(meeting.startTime) && (
                    <p className="text-sm text-blue-500">
                      {getTimeUntilMeeting(meeting.startTime)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetings;
