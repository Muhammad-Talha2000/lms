import express from "express";
import {
  getScheduledMeetings,
  scheduleNextMeeting,
} from "../controllers/liveMeetingControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getCalendarMeetings } from "../controllers/meetControllers.js";

const router = express.Router();

router.post("/create-meeting", authenticateUser, scheduleNextMeeting);
router.get("/scheduled-meetings", authenticateUser, getScheduledMeetings);
router.get("/calendar", getCalendarMeetings);
export default router;
