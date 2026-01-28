import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getCourseAnnouncements,
  updateAnnouncement,
} from "../controllers/announcementControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:courseId/create", authenticateUser, createAnnouncement);

router.get("/:courseId", getCourseAnnouncements);

router.get("/:announcementId", getAnnouncementById);

// Update a specific announcement
router.put("/:announcementId", authenticateUser, updateAnnouncement);

// Delete an announcement from a course
router.delete(
  "/:courseId/:announcementId",
  authenticateUser,
  deleteAnnouncement
);

export default router;
