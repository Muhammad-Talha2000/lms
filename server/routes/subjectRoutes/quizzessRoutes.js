import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware.js";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getStudentQuizAttempt,
  submitQuizAttempt,
} from "../../controllers/subjectsControllers/QuizControllers.js";

const router = express.Router();

router.post("/:subjectId", authenticateUser, createQuiz);
router.put("/:subjectId/:quizId", authenticateUser, editQuiz);
router.delete("/:subjectId/:quizId", authenticateUser, deleteQuiz);
router.patch("/:subjectId/:quizId", authenticateUser, submitQuizAttempt);
router.get("/:subjectId/:quizId", authenticateUser, getStudentQuizAttempt);

export default router;
