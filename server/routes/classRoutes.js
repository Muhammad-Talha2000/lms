import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  enrollStudentsinClass,
} from "../controllers/classController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getClasses);
router.get("/:id", getClassById);
router.post("/", authenticateUser, createClass);
router.post("/enroll/:classId", authenticateUser, enrollStudentsinClass);
router.put("/:id", authenticateUser, updateClass);
router.delete("/:id", authenticateUser, deleteClass);

export default router;
