import Class from "../models/Class.js";
import BaseUser from "../models/auth/BaseUser.js";
import Student from "../models/auth/Student.js";
// Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("subjects")
      .populate("students");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)

      .populate("subjects")
      .populate("students");
    if (!classData) return res.status(404).json({ message: "Class not found" });
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new class (Admin Only)
export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const { id, role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a class (Admin Only)
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const { id, role } = req.user;
    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin can update a class only." });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a class (Admin Only)
export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    const { id, role } = req.user;
    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin can delete a class only." });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollStudentsinClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const classData = await Class.findById(classId);
    if (!classData) return res.status(404).json({ message: "Class not found" });

    if (classData.students.includes(studentId))
      return res
        .status(400)
        .json({ message: "Student already enrolled in class" });

    classData.students.push(studentId);

    await classData.save();
    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};
