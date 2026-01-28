import React from "react";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";

const CourseSchedule = ({ formData, onChange }) => {
  if (formData.courseType === "Recorded") {
    return null;
  }

  const handleScheduleChange = (field, value, scheduleType) => {
    onChange({
      field: scheduleType,
      value: {
        ...formData[scheduleType],
        [field]: value,
      },
    });
  };

  const handleOneToOneScheduleChange = (field, value) => {
    onChange({
      field: "oneToOneSchedules",
      value: [
        {
          ...formData.oneToOneSchedules?.[0],
          [field]: value,
        },
      ],
    });
  };

  const addNewSchedule = () => {
    const currentSchedules = formData.oneToOneSchedules?.[0]?.schedules || [];
    onChange({
      field: "oneToOneSchedules",
      value: [
        {
          ...formData.oneToOneSchedules?.[0],
          schedules: [...currentSchedules, { startTime: "", endTime: "" }],
        },
      ],
    });
  };

  const removeSchedule = (index) => {
    const currentSchedules = formData.oneToOneSchedules?.[0]?.schedules || [];
    onChange({
      field: "oneToOneSchedules",
      value: [
        {
          ...formData.oneToOneSchedules?.[0],
          schedules: currentSchedules.filter((_, i) => i !== index),
        },
      ],
    });
  };

  const updateSchedule = (index, field, value) => {
    const currentSchedules = formData.oneToOneSchedules?.[0]?.schedules || [];
    onChange({
      field: "oneToOneSchedules",
      value: [
        {
          ...formData.oneToOneSchedules?.[0],
          schedules: currentSchedules.map((schedule, i) =>
            i === index ? { ...schedule, [field]: value } : schedule
          ),
        },
      ],
    });
  };

  const renderLiveSchedule = () => (
    <div className="space-y-4">
      {/* Start & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={formData.liveSchedule?.startDate || ""}
            onChange={(e) =>
              handleScheduleChange("startDate", e.target.value, "liveSchedule")
            }
            min={format(new Date(), "yyyy-MM-dd")}
            className="w-full p-2 border rounded-md focus:outline-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={formData.liveSchedule?.endDate || ""}
            onChange={(e) =>
              handleScheduleChange("endDate", e.target.value, "liveSchedule")
            }
            min={formData.liveSchedule?.startDate}
            className="w-full p-2 border rounded-md focus:outline-orange-500"
            required
          />
        </div>
      </div>

      {/* Days of Week */}
      <div>
        <label className="block text-sm font-medium mb-1">Days of Week</label>
        <div className="flex flex-wrap gap-2">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day, index) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  formData.liveSchedule?.daysOfWeek?.includes(index) || false
                }
                onChange={(e) => {
                  const newDays = e.target.checked
                    ? [...(formData.liveSchedule?.daysOfWeek || []), index]
                    : (formData.liveSchedule?.daysOfWeek || []).filter(
                        (d) => d !== index
                      );
                  handleScheduleChange("daysOfWeek", newDays, "liveSchedule");
                }}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Class Start & End Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Class Start Time
          </label>
          <input
            type="time"
            value={formData.liveSchedule?.startTime || ""}
            onChange={(e) =>
              handleScheduleChange("startTime", e.target.value, "liveSchedule")
            }
            className="w-full p-2 border rounded-md focus:outline-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Class End Time
          </label>
          <input
            type="time"
            value={formData.liveSchedule?.endTime || ""}
            onChange={(e) =>
              handleScheduleChange("endTime", e.target.value, "liveSchedule")
            }
            className="w-full p-2 border rounded-md focus:outline-orange-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderOneToOneSchedule = () => (
    <div className="space-y-4">
      {/* Days of Week */}
      <div>
        <label className="block text-sm font-medium mb-1">Days of Week</label>
        <div className="flex flex-wrap gap-2">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day, index) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  formData.oneToOneSchedules?.[0]?.daysOfWeek?.includes(
                    index
                  ) || false
                }
                onChange={(e) => {
                  const newDays = e.target.checked
                    ? [
                        ...(formData.oneToOneSchedules?.[0]?.daysOfWeek || []),
                        index,
                      ]
                    : (
                        formData.oneToOneSchedules?.[0]?.daysOfWeek || []
                      ).filter((d) => d !== index);
                  handleOneToOneScheduleChange("daysOfWeek", newDays);
                }}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Multiple Time Slots */}
      {(formData.oneToOneSchedules?.[0]?.schedules || []).map(
        (schedule, index) => (
          <div
            key={index}
            className="p-4 border rounded-md space-y-3 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Time Slot {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={schedule.startTime || ""}
                  onChange={(e) =>
                    updateSchedule(index, "startTime", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:outline-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={schedule.endTime || ""}
                  onChange={(e) =>
                    updateSchedule(index, "endTime", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:outline-orange-500"
                  required
                />
              </div>
            </div>
          </div>
        )
      )}

      {/* Show message when no schedules exist */}
      {!formData.oneToOneSchedules?.[0]?.schedules?.length && (
        <p className="text-center text-gray-500 py-4">
          No time slots added yet.
        </p>
      )}

      {/* Add Schedule Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addNewSchedule}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          Add Time Slot
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-medium">Course Schedule</h3>
      {formData.courseType === "Live" && renderLiveSchedule()}
      {formData.courseType === "One-to-One" && renderOneToOneSchedule()}
    </div>
  );
};

export default CourseSchedule;
