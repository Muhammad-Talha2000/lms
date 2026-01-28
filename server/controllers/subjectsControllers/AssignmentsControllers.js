import Subjects from "../../models/Subjects.js";

export const createAssignment = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, description, dueDate } = req.body;

    const subject = await Subjects.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newAssignment = { title, description, dueDate };
    subject.assignments.push(newAssignment);

    await subject.save();
    const addedAssignment = subject.assignments[subject.assignments.length - 1];
    return res.json({ message: "Assignment created successfully", assignment: addedAssignment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const editAssignment = async (req, res) => {
  try {
    const { subjectId, assignmentId } = req.params;
    const { title, description, dueDate } = req.body;

    const subject = await Subjects.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const assignment = subject.assignments.id(assignmentId);

    assignment.title = title;
    assignment.description = description;
    assignment.dueDate = dueDate;
    await subject.save();

    return res.json({ message: "Assignment updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { subjectId, assignmentId } = req.params;

    const subject = await Subjects.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.assignments = subject.assignments.filter(
      (assignment) => assignment._id.toString() !== assignmentId
    );

    await subject.save();

    return res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { subjectId, assignmentId } = req.params;
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

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const assignment = subject.assignments.id(assignmentId);
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

    await subject.save();

    res.status(200).json({
      message: "Assignment submitted successfully",
      submission: assignment.submissions[assignment.submissions.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting assignment",
      error: error.message,
    });
  }
};

export const getStudentAssignmentSubmission = async (req, res) => {
  try {
    const { subjectId, assignmentId } = req.params;
    const studentId = req.user.id;

    const subject = await Subjects.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const assignment = subject.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    res.status(200).json({ submission });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching submission",
      error: error.message,
    });
  }
};
