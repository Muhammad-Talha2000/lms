import Course from "../models/Courses.js";
import Instructor from "../models/auth/Instructor.js";
import mongoose from "mongoose";
import Student from "../models/auth/Student.js";
import {
  convertToUTC,
  convertToLocalTime,
  getUserTimeZone,
  convertCourseScheduleToUserTime,
} from "../utils/timeZoneHelper.js";
import Notification from "../models/Notification.js";
import { completeStudentEnrollment } from "../services/studentEnrollmentService.js";

export const createCourse = async (req, res) => {
  const {
    name,
    description,
    thumbnail,
    tags = [],
    duration,
    courseLevel,
    price,
    language,
    lessons = [],
    courseType,
    liveSchedule,
    oneToOneSchedules,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !duration ||
    !courseLevel ||
    !price ||
    !language ||
    !courseType
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    const { id, role } = req.user;
    const validInstructor = await Instructor.findById(id);

    if (!role || role !== "instructor" || !validInstructor) {
      return res
        .status(403)
        .json({ message: "Only valid instructors can create courses" });
    }

    const userTimeZone = getUserTimeZone(req);
    // console.log(userTimeZone);

    // Handling Course Type-Specific Validations
    if (courseType === "Live") {
      if (
        !liveSchedule ||
        !liveSchedule.startDate ||
        !liveSchedule.endDate ||
        !Array.isArray(liveSchedule.daysOfWeek) ||
        liveSchedule.daysOfWeek.length === 0 ||
        !liveSchedule.startTime ||
        !liveSchedule.endTime
      ) {
        return res.status(400).json({
          message: "Live courses must include complete schedule information",
          details: {
            required: [
              "startDate",
              "endDate",
              "daysOfWeek (array with at least one day)",
              "startTime",
              "endTime",
            ],
          },
        });
      }

      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (
        !timeRegex.test(liveSchedule.startTime) ||
        !timeRegex.test(liveSchedule.endTime)
      ) {
        return res.status(400).json({
          message: "Invalid time format. Please use HH:mm format (e.g., 14:30)",
        });
      }

      // Validate days of week (0-6)
      if (!liveSchedule.daysOfWeek.every((day) => day >= 0 && day <= 6)) {
        return res.status(400).json({
          message:
            "Invalid days of week. Days must be numbers from 0 (Sunday) to 6 (Saturday)",
        });
      }

      // Validate dates
      const startDate = new Date(liveSchedule.startDate);
      const endDate = new Date(liveSchedule.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date format for start or end date",
        });
      }

      if (endDate <= startDate) {
        return res.status(400).json({
          message: "End date must be after start date",
        });
      }
    }

    // One-to-One Schedule Validation (Updated Schema)
    if (courseType === "One-to-One") {
      if (!oneToOneSchedules || !Array.isArray(oneToOneSchedules)) {
        return res.status(400).json({
          message: "One-to-One courses must include schedule details",
        });
      }

      for (let session of oneToOneSchedules) {
        const { daysOfWeek, schedules } = session;

        if (!Array.isArray(daysOfWeek) || !Array.isArray(schedules)) {
          return res.status(400).json({
            message:
              "Each session must have assigned days and valid schedule timings",
          });
        }

        // Validate days of the week
        if (!daysOfWeek.every((day) => day >= 0 && day <= 6)) {
          return res.status(400).json({
            message:
              "Invalid days of the week. Days must be numbers from 0 (Sunday) to 6 (Saturday)",
          });
        }

        // Validate each time slot
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        for (let timing of schedules) {
          const { startTime, endTime } = timing;

          if (!startTime || !endTime) {
            return res.status(400).json({
              message: "Each session must have a start time and an end time",
            });
          }

          if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({
              message: "Invalid time format. Use HH:mm format (e.g., 14:30)",
            });
          }

          if (startTime >= endTime) {
            return res.status(400).json({
              message: "Session start time must be before end time",
            });
          }
        }
      }
    }

    // Creating a new course
    const newCourse = new Course({
      name,
      description,
      thumbnail,
      instructor: id,
      tags,
      duration,
      courseLevel,
      price,
      language,
      lessons,
      courseType,
      timezone: userTimeZone,
      liveSchedule:
        courseType === "Live"
          ? {
              startDate: new Date(liveSchedule.startDate),
              endDate: new Date(liveSchedule.endDate),
              daysOfWeek: liveSchedule.daysOfWeek,
              startTime: liveSchedule.startTime,
              endTime: liveSchedule.endTime,
            }
          : undefined,
      oneToOneSchedules:
        courseType === "One-to-One" ? oneToOneSchedules : undefined,
    });

    await newCourse.save();

    // Notification

    const notification = new Notification({
      message: `A new course "${name}" has been created by ${validInstructor.name}.`,
      type: "info",
    });

    await notification.save();

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

// Get courses
export const getCourses = async (req, res) => {
  try {
    console.log("📚 [COURSES] Fetching all courses...");
    let courses = await Course.find()
      .populate("instructor")
      .populate("enrolledStudents");

    console.log(`📚 [COURSES] Found ${courses.length} total courses`);
    console.log(`📚 [COURSES] Published courses: ${courses.filter(c => c.published).length}`);

    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ [COURSES] Error fetching courses:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(userTimeZone);

    let course = await Course.findById(id)
      .populate("instructor")
      .populate("enrolledStudents");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// update course
export const updateCourse = async (req, res) => {
  try {
    // Extract instructor ID and role from token (attached by middleware)
    const courseId = req.params.id;
    const { id, role } = req.user;

    // Check if the user is an instructor
    if (role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can update courses" });
    }

    if (!courseId) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify the instructor exists in the database
    const validInstructor = await Instructor.findById(id);
    if (!validInstructor) {
      return res
        .status(404)
        .json({ message: "Instructor not found or invalid" });
    }

    // Find the course to ensure it exists
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the instructor is the owner of the course
    if (existingCourse.instructor.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    // Extract fields to update from the request body
    const {
      name,
      description,
      thumbnail,
      tags,
      duration,
      courseLevel,
      price,
      language,
      lessons,
      reviews,
      enrolledStudents,
      assignments,
      quizzes,
      contentLibrary,
      courseType,
      ...extraData
    } = req.body;

    // Update the course with the new data
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          name,
          description,
          thumbnail,
          tags,
          duration,
          courseLevel,
          price,
          language,
          lessons,
          reviews,
          enrolledStudents,
          assignments,
          quizzes,
          contentLibrary,
          courseType,
          ...extraData, // Spread to include any extra data if provided
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers, score } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = course.quizzes.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if student has already attempted this quiz
    const existingAttempt = quiz.attempts.find(
      (attempt) => attempt.student.toString() === studentId
    );

    if (existingAttempt) {
      return res
        .status(400)
        .json({ message: "You have already attempted this quiz" });
    }

    // Add the new attempt
    quiz.attempts.push({
      student: studentId,
      answers,
      score,
    });

    await course.save();

    res.status(200).json({ message: "Quiz attempt saved successfully" });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
};

// Get student quiz attempt
export const getStudentQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const studentId = req.user.id;

    // Validate params
    if (!courseId || !quizId) {
      return res.status(400).json({
        message: "Course ID and Quiz ID are required",
      });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({
        message: "Invalid Course ID or Quiz ID format",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = course.quizzes.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attempt = quiz.attempts?.find(
      (attempt) => attempt.student.toString() === studentId
    );

    res.status(200).json({ attempt });
  } catch (error) {
    console.error("Error getting quiz attempt:", error);
    res.status(500).json({
      message: "Error fetching quiz attempt",
      error: error.message,
    });
  }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const studentId = req.user.id;

    // Handle raw string URL
    let fileUrl;
    if (typeof req.body === "string") {
      fileUrl = req.body;
    } else {
      fileUrl = req.body.fileUrl;
    }

    // Validate required fields
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const assignment = course.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if student has already submitted
    const existingSubmission = assignment.submissions.find(
      (submission) => submission.student.toString() === studentId
    );

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted this assignment",
      });
    }

    // Check if past due date
    const isLate =
      assignment.dueDate && new Date() > new Date(assignment.dueDate);
    if (isLate) {
      return res.status(400).json({
        message: "Assignment submission period has ended",
      });
    }

    // Add the submission
    assignment.submissions.push({
      student: studentId,
      fileUrl,
      status: isLate ? "late" : "submitted",
    });

    await course.save();

    res.status(200).json({
      message: "Assignment submitted successfully",
      submission: assignment.submissions[assignment.submissions.length - 1],
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({
      message: "Error submitting assignment",
      error: error.message,
    });
  }
};

// Get student assignment submission
export const getStudentAssignmentSubmission = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const assignment = course.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    res.status(200).json({ submission });
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({
      message: "Error fetching submission",
      error: error.message,
    });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId, selectedSchedule } = req.body;

    const result = await completeStudentEnrollment({
      courseId,
      studentId,
      selectedSchedule,
    });

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({
      message: "Enrollment successful!",
      course: result.course,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Failed to enroll in the course" });
  }
};

export const toggleCoursePublish = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { courseId } = req.params;

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can publish courses" });
    }

    const { published } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { published },
      { new: true }
    );

    res.status(200).json({
      message: `Course has been ${published ? "published" : "unpublished"}`,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate({
      path: "discussions",
      populate: [
        { path: "author", select: "name role" },
        {
          path: "replies",
          populate: { path: "author", select: "name role" },
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({
      message: "Failed to fetch discussions",
      error: error.message,
    });
  }
};

// Create a discussion post (only enrolled students or instructor)
export const createDiscussionPost = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, module } = req.body;
    const userId = req.user.id; // Extracted from authentication middleware

    // Find the course and check if the user is enrolled
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isInstructor = course.instructor.toString() === userId;
    const isEnrolledStudent = course.enrolledStudents.some(
      (student) => student.toString() === userId
    );

    if (!isInstructor && !isEnrolledStudent) {
      return res.status(403).json({
        message: "Only enrolled students or the instructor can post.",
      });
    }

    const newDiscussion = {
      title,
      description,
      module,
      author: userId,
      likes: 0,
      replies: [],
    };

    course.discussions.push(newDiscussion);
    await course.save();

    res.status(201).json(course.discussions.slice(-1)[0]); // Return the new discussion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a discussion post
export const toggleLike = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user.id; // Assuming you're using authentication middleware

    const course = await Course.findOne({ "discussions._id": discussionId });
    if (!course) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const discussion = course.discussions.id(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const likedIndex = discussion.likedBy.indexOf(userId);

    if (likedIndex === -1) {
      // If not liked, add userId to likedBy
      discussion.likedBy.push(userId);
    } else {
      // If already liked, remove userId from likedBy
      discussion.likedBy.splice(likedIndex, 1);
    }

    await course.save();

    return res.json({
      message:
        likedIndex === -1 ? "Liked successfully" : "Unliked successfully",
      likes: discussion.likedBy.length, // Return updated like count
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a reply to a discussion post
export const addReply = async (req, res) => {
  try {
    const { courseId, discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Extracted from authentication middleware

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const discussion = course.discussions.id(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const newReply = {
      content,
      author: userId,
      createdAt: new Date(),
    };

    discussion.replies.push(newReply);
    await course.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { courseId, discussionId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const discussion = course.discussions.id(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    if (discussion.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete post" });
    }

    course.discussions.pull(discussionId); // ✅ Correct way to remove
    await course.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
