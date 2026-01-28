import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const InstructorSchema = new mongoose.Schema({
  coursesCreated: [
    {
      type: String, // Course IDs or references to a Course schema
    },
  ],
  earnings: {
    type: Number, // Total earnings for courses
    default: 0,
  },
  qualification: {
    type: String, // Qualifications of the instructor
  },
  subjects: {
    type: String, // Subjects the instructor is qualified to teach
  },
  teaching_experience: {
    type: Number, // Number of years of teaching experience
  },
});

// Use discriminator to inherit from BaseUser
const Instructor = BaseUser.discriminator("Instructor", InstructorSchema);
export default Instructor;
