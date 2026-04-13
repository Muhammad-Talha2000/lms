import Class from "../models/Class.js";
import Student from "../models/auth/Student.js";
import Subject from "../models/Subjects.js";
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

const pickClassUpdateFields = (body) => {
  const keys = ["name", "description", "price", "thumbnail"];
  const out = {};
  for (const k of keys) {
    if (body[k] !== undefined && body[k] !== null) out[k] = body[k];
  }
  if (out.price !== undefined) out.price = Number(out.price);
  return out;
};

// Update a class: admin, or instructor assigned to at least one subject in the class
export const updateClass = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const classData = await Class.findById(req.params.id).populate({
      path: "subjects",
      select: "instructor",
    });
    if (!classData) return res.status(404).json({ message: "Class not found" });

    let allowed = false;
    if (role === "admin") allowed = true;
    else if (role === "instructor") {
      allowed = classData.subjects.some(
        (s) => s.instructor?.toString() === userId.toString()
      );
    }

    if (!allowed) {
      return res.status(403).json({
        message:
          "Access denied. Only an admin or an instructor assigned to a subject in this class can update it.",
      });
    }

    const payload = pickClassUpdateFields(req.body);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    )
      .populate("subjects")
      .populate("students");

    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClassesForInstructor = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Instructors only." });
    }
    const subjectIds = await Subject.find({
      instructor: req.user.id,
    }).distinct("_id");
    if (!subjectIds.length) {
      return res.status(200).json([]);
    }
    const classes = await Class.find({ subjects: { $in: subjectIds } })
      .populate("subjects")
      .populate("students");
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
