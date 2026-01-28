import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import {
  addLesson,
  deleteLesson,
  editLesson,
} from "../../controllers/subjectsControllers/LessonsControllers.js";

const router = express.Router();

router.post("/:subjectId", authenticateUser, addLesson);
router.put("/:subjectId/:lessonId", authenticateUser, editLesson);
router.delete("/:subjectId/:lessonId", authenticateUser, deleteLesson);

export default router;
