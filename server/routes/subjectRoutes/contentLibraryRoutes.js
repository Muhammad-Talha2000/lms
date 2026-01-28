import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import {
  addContent,
  deleteContent,
  editContent,
} from "../../controllers/subjectsControllers/ContentLibraryControllers.js";

const router = express.Router();

router.post("/:subjectId", authenticateUser, addContent);
router.put("/:subjectId/:contentId", authenticateUser, editContent);
router.delete("/:subjectId/:contentId", authenticateUser, deleteContent);

export default router;
