import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: "" },
    subjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    ],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    liveSessions: [
      {
        instructor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Instructor",
        },
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },

        startTime: { type: String },
        endTime: { type: String },
        meetingUrl: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
