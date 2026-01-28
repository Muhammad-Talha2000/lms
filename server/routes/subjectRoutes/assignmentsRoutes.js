import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import {
  createAssignment,
  deleteAssignment,
  editAssignment,
  getStudentAssignmentSubmission,
  submitAssignment,
} from "../../controllers/subjectsControllers/AssignmentsControllers.js";

const router = express.Router();

router.post("/:subjectId", authenticateUser, createAssignment);
router.put("/:subjectId/:assignmentId", authenticateUser, editAssignment);
router.delete("/:subjectId/:assignmentId", authenticateUser, deleteAssignment);
router.patch("/:subjectId/:assignmentId", authenticateUser, submitAssignment);
router.get(
  "/:subjectId/:assignmentId",
  authenticateUser,
  getStudentAssignmentSubmission
);

export default router;
