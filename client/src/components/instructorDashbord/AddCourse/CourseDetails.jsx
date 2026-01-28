// import React from "react";

// const CourseDetails = ({ formData, onChange }) => {
//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium mb-1">Language</label>
//         <select
//           name="language"
//           value={formData.language}
//           onChange={onChange}
//           className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
//           required
//         >
//           <option value="">Select Language</option>
//           <option value="English">English</option>
//           <option value="Spanish">Urdu</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Course Type</label>
//         <select
//           name="courseType"
//           value={formData.courseType}
//           onChange={onChange}
//           className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
//           required
//         >
//           <option value="Recorded">Recorded</option>
//           <option value="Live">Live Session</option>
//           <option value="One-to-One">One to One</option>
//         </select>
//       </div>

//       {/* level and duration  */}
//       <div className="w-full">
//         <div className="flex flex-col sm:flex-row gap-8 w-full">
//           {/* Course Level */}
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1 w-full">
//               Course Level
//             </label>
//             <select
//               name="courseLevel"
//               value={formData.courseLevel}
//               onChange={onChange}
//               className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
//               required
//             >
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>
//           </div>

//           {/* Duration */}
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1 w-full">
//               Duration
//             </label>
//             <input
//               type="text"
//               name="duration"
//               value={formData.duration}
//               onChange={onChange}
//               className="w-full p-2 border rounded-md focus:outline-orange-500"
//               placeholder="e.g., 10h 30m"
//               required
//             />
//           </div>
//         </div>
//       </div>
//       <div>
//         <label className="block text-sm font-medium mb-1">Tags</label>
//         <input
//           type="text"
//           name="tags"
//           value={formData.tags}
//           onChange={onChange}
//           placeholder="e.g. Web development, Python, JavaScript"
//           className="w-full p-2 border rounded-md focus:outline-orange-500 "
//           required
//         />
//       </div>
//     </div>
//   );
// };

// export default CourseDetails;

import React from "react";
import CourseSchedule from "./CourseSchedule";

const CourseDetails = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Language</label>
        <select
          name="language"
          value={formData.language}
          onChange={onChange}
          className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
          required
        >
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Spanish">Urdu</option>
        </select>
      </div>

      {/* <div>
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
      </div> */}

      <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-8 w-full">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 w-full">
              Course Level
            </label>
            <select
              name="courseLevel"
              value={formData.courseLevel}
              onChange={onChange}
              className="w-full p-2 border rounded-md focus:outline-orange-500 bg-orange-100"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 w-full">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={onChange}
              className="w-full p-2 border rounded-md focus:outline-orange-500"
              placeholder="e.g., 10h 30m"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={onChange}
          placeholder="e.g. Web development, Python, JavaScript"
          className="w-full p-2 border rounded-md focus:outline-orange-500"
          required
        />
      </div>
    </div>
  );
};

export default CourseDetails;
