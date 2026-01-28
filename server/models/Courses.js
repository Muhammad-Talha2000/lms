import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "", // URL of the course thumbnail image
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor", // Reference to the Instructor model
      required: true,
    },
    // Course Type (New)
    courseType: {
      type: String,
      enum: ["Recorded", "Live", "One-to-One"],
      // required: true,
    },
    tags: [
      {
        type: String, // Tags to help categorize the course
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Reference to a student who wrote the review
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to students enrolled in the course
      },
    ],
    duration: {
      type: String, // Example: "10h 30m" or "15h"
      required: true,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    lessons: [
      {
        title: { type: String, required: true },
        content: { type: String, required: false }, // Lesson content (e.g., text, video URL, etc.)
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

    quizzes: [
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
        name: { type: String, required: true }, // Example: "Chapter 1 notes"
        type: { type: String }, // Example: "pdf", "video", "docx"
        url: { type: String, required: true }, // URL to the resource
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0, // Price of the course
    },
    language: {
      type: String,
      required: true, // Example: "English", "Spanish"
    },

    announcements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcement", // Reference to students enrolled in the course
      },
    ],

    timezone: {
      type: String,
    },

    liveSession: {
      meetingLink: { type: String, default: null },
      meetingId: { type: String, default: null },
      startTime: { type: Date },
      duration: { type: Number },
      topic: { type: String },
      isActive: { type: Boolean, default: false },
      bookingReference: { type: mongoose.Schema.Types.ObjectId },
    },

    // Live Course Schedule (For All Students)
    liveSchedule: {
      startDate: { type: Date }, // When the course starts
      endDate: { type: Date }, // When the course ends
      daysOfWeek: [{ type: Number }], // 0=Sunday, 1=Monday, etc.
      startTime: { type: String }, // Fixed start time for all classes
      endTime: { type: String }, // Fixed end time for all classes
    },

    oneToOneSchedules: [
      {
        daysOfWeek: [{ type: Number, required: true }],
        schedules: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isBooked: { type: Boolean, default: false },
            studentId: { type: mongoose.Schema.Types.ObjectId },
          },
        ],
      },
    ],

    discussions: [
      {
        module: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "BaseUser" }], // Users who liked the post
        replies: [
          {
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "BaseUser",
              required: true,
            },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BaseUser",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
