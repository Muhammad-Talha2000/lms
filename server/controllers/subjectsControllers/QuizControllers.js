import mongoose from "mongoose";
import Subjects from "../../models/Subjects.js";

export const createQuiz = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, questions } = req.body;

    // Find the subject
    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Validate the structure of the questions array
    if (
      !Array.isArray(questions) ||
      questions.length === 0 ||
      !questions.every(
        (q) =>
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length >= 2 &&
          q.options.every((opt) => typeof opt === "string") &&
          typeof q.correctAnswer === "number" &&
          q.correctAnswer >= 0 &&
          q.correctAnswer < q.options.length
      )
    ) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    // Create the quiz object
    const newQuiz = {
      title,
      questions,
      attempts: [],
    };

    // Add quiz to the subject
    subject.quizzess.push(newQuiz);
    await subject.save();

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const editQuiz = async (req, res) => {
  try {
    const { subjectId, quizId } = req.params;
    const { title, questions } = req.body;

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const quiz = subject.quizzess.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (title) {
      quiz.title = title;
    }
    if (questions) {
      if (
        !Array.isArray(questions) ||
        questions.length === 0 ||
        !questions.every(
          (q) =>
            typeof q.question === "string" &&
            Array.isArray(q.options) &&
            q.options.length >= 2 &&
            q.options.every((opt) => typeof opt === "string") &&
            typeof q.correctAnswer === "number" &&
            q.correctAnswer >= 0 &&
            q.correctAnswer < q.options.length
        )
      ) {
        return res.status(400).json({ message: "Invalid questions format" });
      }
      quiz.questions = questions;
    }
    await subject.save();
    return res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { subjectId, quizId } = req.params;

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const quiz = subject.quizzess.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.remove();
    await subject.save();

    return res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    const { subjectId, quizId } = req.params;
    const { answers, score } = req.body;
    const studentId = req.user.id;

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = subject.quizzess.id(quizId);
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

    await subject.save();

    res.status(200).json({ message: "Quiz attempt saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
};

export const getStudentQuizAttempt = async (req, res) => {
  try {
    const { subjectId, quizId } = req.params;
    const studentId = req.user.id;

    // Validate params
    if (!subjectId || !quizId) {
      return res.status(400).json({
        message: "Course ID and Quiz ID are required",
      });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(quizId)
    ) {
      return res.status(400).json({
        message: "Invalid Course ID or Quiz ID format",
      });
    }

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = subject.quizzess.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attempt = quiz.attempts?.find(
      (attempt) => attempt.student.toString() === studentId
    );

    res.status(200).json({ attempt });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching quiz attempt",
      error: error.message,
    });
  }
};
