// import mongoose from "mongoose";
// import BaseUser from "./BaseUser.js";

// const StudentSchema = new mongoose.Schema({
//   coursesEnrolled: [
//     {
//       type: String, // Course IDs or references to a Course schema
//     },
//   ],
//   progress: {
//     type: Map, // A map to track progress by course
//     of: Number, // e.g., {"courseId1": 75, "courseId2": 50}
//   },
//   profile: {
//     type: String,
//   },
//   dob: {
//     type: Date
//   },
//   address: {
//     type: String,
//   },
// });

// // Use discriminator to inherit from BaseUser
// const Student = BaseUser.discriminator("Student", StudentSchema);
// export default Student;

import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const StudentSchema = new mongoose.Schema({
  coursesEnrolled: [
    {
      type: String, // Course IDs or references to a Course schema
    },
  ],
  progress: {
    type: Map, // A map to track progress by course
    of: Number, // e.g., {"courseId1": 75, "courseId2": 50}
  },
});

// Use discriminator to inherit from BaseUser
const Student = BaseUser.discriminator("Student", StudentSchema);
export default Student;
