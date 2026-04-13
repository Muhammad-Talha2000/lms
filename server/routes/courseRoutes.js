import express from "express";
import {
  addReply,
  createCourse,
  createDiscussionPost,
  deletePost,
  enrollStudent,
  getCourseById,
  getCourses,
  getDiscussions,
  getStudentAssignmentSubmission,
  getStudentQuizAttempt,
  submitAssignment,
  submitQuizAttempt,
  toggleLike,
  toggleCoursePublish,
  updateCourse,
} from "../controllers/CourseControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

// Route for creating a course
router.post("/create", authenticateUser, createCourse);

// Route for getting all the courses
router.get("/", getCourses);

// update course
router.put("/edit/:id", authenticateUser, updateCourse);

// quiz attempt
router.post(
  "/:courseId/quizzes/:quizId/attempts",
  authenticateUser,
  submitQuizAttempt
);

// get quiz attemp report
router.get(
  "/:courseId/quizzes/:quizId/attempts/student",
  authenticateUser,
  getStudentQuizAttempt
);

// Assignment Submission
router.post(
  "/:courseId/assignments/:assignmentId/submit",
  authenticateUser,
  submitAssignment
);

// Get Assignment Submission
router.get(
  "/:courseId/assignments/:assignmentId/submission",
  authenticateUser,
  getStudentAssignmentSubmission
);

// Enroll student
router.post("/:courseId/enroll", authenticateUser, enrollStudent);

// create discussion post
router.post("/:courseId/discussions", authenticateUser, createDiscussionPost);

// get all discussions
router.get("/:courseId/discussions", authenticateUser, getDiscussions);

// Like/unlike a discussion post
router.put(
  "/:courseId/discussions/:discussionId/like",
  authenticateUser,
  toggleLike
);

// Add a reply to a discussion post
router.post(
  "/:courseId/discussions/:discussionId/replies",
  authenticateUser,
  addReply
);

// delete post discuusion
router.delete(
  "/:courseId/discussions/:discussionId",
  authenticateUser,
  deletePost
);
router.patch("/:courseId/publish", authenticateUser, toggleCoursePublish);

// Single-segment course id — must be registered after all "/:param/..." routes
router.get("/:id", getCourseById);

export default router;
