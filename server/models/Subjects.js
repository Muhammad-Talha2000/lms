import mongoose from "mongoose";
import Class from "./Class.js";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  lessons: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  assignments: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      dueDate: { type: Date },
      submissions: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          fileUrl: { type: String, required: true },
          submittedAt: { type: Date, default: Date.now },
          status: {
            type: String,
            enum: ["submitted", "late"],
            default: "submitted",
          },
        },
      ],
    },
  ],
  quizzess: [
    {
      title: { type: String, required: true },
      questions: [
        {
          question: { type: String, required: true },
          options: [{ type: String, required: true }],
          correctAnswer: { type: Number, required: true },
        },
      ],
      attempts: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
          },
          answers: [{ type: Number, required: true }],
          score: { type: Number, required: true },
          submittedAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  contentLibrary: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],

  liveSchedules: [
    {
      dayOfWeek: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});
// Mongoose post-save hook to add the subject to the class

subjectSchema.post("save", async function (doc, next) {
  try {
    await Class.findByIdAndUpdate(doc.classId, {
      $push: { subjects: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});
export default mongoose.model("Subject", subjectSchema);
// Compare this snippet from server/models/Instructor.js:
