import express from "express";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSubjects); // Public
router.get("/:id", getSubjectById); // Public
router.post("/:classId", authenticateUser, createSubject); // Admin Only
router.put("/:id", authenticateUser, updateSubject); // Admin Only
router.delete("/:id", authenticateUser, deleteSubject); // Admin Only

export default router;
