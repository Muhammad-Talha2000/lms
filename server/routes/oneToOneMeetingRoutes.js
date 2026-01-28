import express from "express";
import {
  getOneToOneMeetings,
  scheduleOneToOneMeeting,
} from "../controllers/oneToOneMeetingControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import Course from "../models/Courses.js";

const router = express.Router();

// Route to schedule a one-to-one meeting
router.post("/schedule", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId)
      return res.status(400).json({ error: "Course ID is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const session = await scheduleOneToOneMeeting(course);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all scheduled One-to-One meetings
router.get("/scheduled", authenticateUser, getOneToOneMeetings);

export default router;
