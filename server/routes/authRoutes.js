import express from "express";
import {
  createUser,
  editUser,
  getUserProfile,
  loginUser,
  getAllUsers,
  logoutUser,
  toggleInstructorStatus,
} from "../controllers/authControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create User
router.post("/register", createUser);

// Login User
router.post("/login", loginUser);

// Edit User
router.put("/edit", authenticateUser, editUser);

// Get User Profile
router.get("/profile", authenticateUser, getUserProfile);

// Get All users
router.get("/users", authenticateUser, getAllUsers);

// Logout User
router.post("/logout", logoutUser);

// toggle status
router.put(
  "/toggle-status/:instructorId",
  authenticateUser,
  toggleInstructorStatus
);

export default router;
