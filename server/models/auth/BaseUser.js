// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// // Define the Base Schema for common fields
// const BaseUserSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       default: uuidv4,
//       unique: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     mobile: {
//       type: String,
//       required: true,

//     },
//     role: {
//       type: String,
//       required: true,
//       enum: ["student", "instructor", "admin", "guardian"], // Define valid roles
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true } // Auto-generate `createdAt` and `updatedAt`
// );

// // Middleware to update `updatedAt` field
// BaseUserSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// export default mongoose.model("BaseUser", BaseUserSchema);

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define the Base Schema for common fields
const BaseUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "instructor", "admin", "guardian"], // Define valid roles
    },
    profileImage: {
      type: String, // Store Cloudinary URL
      default: "", // Default empty string until user uploads
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    loggedInIP: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Auto-generate `createdAt` and `updatedAt`
);

// Middleware to update `updatedAt` field
BaseUserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("BaseUser", BaseUserSchema);
