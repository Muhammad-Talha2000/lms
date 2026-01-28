import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const LiveScheduleForm = ({ liveSchedules, setLiveSchedules }) => {
  const addSchedule = () => {
    setLiveSchedules([
      ...liveSchedules,
      { dayOfWeek: "", startTime: "", endTime: "" },
    ]);
  };

  const removeSchedule = (index) => {
    setLiveSchedules(liveSchedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...liveSchedules];
    updatedSchedules[index][field] = value;
    setLiveSchedules(updatedSchedules);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Live Schedule
      </label>
      {liveSchedules.map((schedule, index) => (
        <div key={index} className="flex space-x-2 mt-2 items-center">
          <select
            value={schedule.dayOfWeek}
            onChange={(e) =>
              handleScheduleChange(index, "dayOfWeek", e.target.value)
            }
            className="border border-gray-300 rounded-md p-2 w-1/3"
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) =>
              handleScheduleChange(index, "startTime", e.target.value)
            }
            className="border border-gray-300 rounded-md p-2 w-1/3"
          />
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) =>
              handleScheduleChange(index, "endTime", e.target.value)
            }
            className="border border-gray-300 rounded-md p-2 w-1/3"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeSchedule(index)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" className="mt-2" onClick={addSchedule}>
        + Add Schedule
      </Button>
    </div>
  );
};

export default LiveScheduleForm;
