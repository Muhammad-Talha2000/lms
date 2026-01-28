import React from "react";
import CourseSchedule from "./CourseSchedule";

const CourseTypeSelection = ({ formData, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Course Type</label>
      <select
        name="courseType"
        value={formData.courseType}
        onChange={(e) => {
          onChange(e);
          // Reset schedule data when course type changes
          if (e.target.value === "Recorded") {
            onChange({
              field: "liveSchedule",
              value: {
                startDate: "",
                endDate: "",
                daysOfWeek: [],
                classTimings: [],
              },
            });
            onChange({
              field: "oneToOneSchedules",
              value: [],
            });
          }
        }}
        className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
        required
      >
        <option value="Recorded">Recorded</option>
        <option value="Live">Live Session</option>
        <option value="One-to-One">One to One</option>
      </select>
      <CourseSchedule formData={formData} onChange={onChange} />
    </div>
  );
};

export default CourseTypeSelection;
