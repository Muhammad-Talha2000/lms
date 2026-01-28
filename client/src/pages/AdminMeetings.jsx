import { useEffect, useState } from "react";

const AdminMeetings = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/zoom/calendar")
      .then((res) => res.json())
      .then((data) => setMeetings(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Upcoming Meetings
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Start Time</th>
              <th className="px-4 py-3 text-left">End Time</th>
              <th className="px-4 py-3 text-left">Meet Link</th>
              <th className="px-4 py-3 text-left">Instructor</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length > 0 ? (
              meetings.map((meeting, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition`}
                >
                  <td className="px-4 py-3">{meeting.title}</td>
                  <td className="px-4 py-3">{meeting.startTime}</td>
                  <td className="px-4 py-3">{meeting.endTime}</td>
                  <td className="px-4 py-3">
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      Join Meeting
                    </a>
                  </td>
                  <td className="px-4 py-3">{meeting.instructor}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No upcoming meetings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMeetings;
