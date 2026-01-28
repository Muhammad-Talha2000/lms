import Class from "../models/Class.js";
import Subject from "../models/Subjects.js";

/**
 * @desc Get all subjects
 * @route GET /api/subjects
 * @access Public
 */
export const getSubjects = async (req, res) => {
  try {
    const { classId } = req.query; // Get classId from query params

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }
    const subjects = await Subject.find().populate("instructor", "name email");
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get a subject by ID
 * @route GET /api/subjects/:id
 * @access Public
 */
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Create a new subject (Admin Only)
 * @route POST /api/subjects
 * @access Private (Admin)
 */
// export const createSubject = async (req, res) => {
//   try {
//     const { name, description, thumbnail, instructor } = req.body;
//     const { classId } = req.params;
//     const { id, role } = req.user;

//     // console.log(name, description, thumbnail, instructor);

//     if (role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     if (!name || !description || !instructor || !thumbnail) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Await the class document
//     const classExist = await Class.findById(classId);

//     if (!classExist) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Create a new subject
//     const newSubject = new Subject({
//       name,
//       description,
//       thumbnail,
//       instructor,
//     });

//     // Push the new subject's ID into the subjects array of the class
//     classExist.subjects.push(newSubject._id);

//     // Save both documents
//     await newSubject.save();
//     await classExist.save();

//     res
//       .status(201)
//       .json({ message: "Subject created successfully", newSubject });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const isTimeOverlap = (existingSchedules, newStartTime, newEndTime) => {
  return existingSchedules.some(({ startTime, endTime }) => {
    return (
      (newStartTime >= startTime && newStartTime < endTime) || // New start time overlaps existing
      (newEndTime > startTime && newEndTime <= endTime) || // New end time overlaps existing
      (newStartTime <= startTime && newEndTime >= endTime) // New period fully covers existing
    );
  });
};

export const createSubject = async (req, res) => {
  try {
    const { name, description, thumbnail, instructor, liveSchedules } =
      req.body;
    const { classId } = req.params;
    const { id, role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check for required fields
    if (!name || !description || !instructor || !thumbnail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate liveSchedules format
    if (liveSchedules && Array.isArray(liveSchedules)) {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      for (const schedule of liveSchedules) {
        const { dayOfWeek, startTime, endTime } = schedule;

        if (!dayOfWeek || !startTime || !endTime) {
          return res.status(400).json({
            message:
              "Each live schedule requires dayOfWeek, startTime, and endTime",
          });
        }

        if (!validDays.includes(dayOfWeek)) {
          return res.status(400).json({
            message: `Invalid dayOfWeek: ${dayOfWeek}. Must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday`,
          });
        }

        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
          return res.status(400).json({
            message: `Invalid time format in schedule for ${dayOfWeek}. Time must be in HH:MM format`,
          });
        }
      }
    } else if (liveSchedules) {
      return res.status(400).json({
        message: "liveSchedules must be an array of schedule objects",
      });
    }

    // Find the class
    const classExist = await Class.findById(classId).populate("subjects");

    if (!classExist) {
      return res.status(404).json({ message: "Class not found" });
    }

    // **Check for Time Conflicts**
    if (liveSchedules && liveSchedules.length > 0) {
      for (const schedule of liveSchedules) {
        const { dayOfWeek, startTime, endTime } = schedule;

        // Get all subjects in the same class that have schedules on the same day
        const conflictingSubject = classExist.subjects.find((subj) =>
          subj.liveSchedules.some(
            (sch) =>
              sch.dayOfWeek === dayOfWeek &&
              isTimeOverlap([sch], startTime, endTime)
          )
        );

        if (conflictingSubject) {
          return res.status(400).json({
            message: `Time slot ${startTime} - ${endTime} on ${dayOfWeek} is already booked for another subject (${conflictingSubject.name}) in this class.`,
          });
        }
      }
    }

    // Create the subject
    const newSubject = new Subject({
      name,
      description,
      thumbnail,
      instructor,
      liveSchedules: liveSchedules || [], // Ensure liveSchedules is always an array
    });

    // Add subject to class
    classExist.subjects.push(newSubject._id);

    // Save both documents
    await newSubject.save();
    await classExist.save();

    res
      .status(201)
      .json({ message: "Subject created successfully", subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update a subject (Admin Only)
 * @route PUT /api/subjects/:id
 * @access Private (Admin)
 */
export const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const { id, role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!updatedSubject)
      return res.status(404).json({ message: "Subject not found" });

    res.status(200).json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Delete a subject (Admin Only)
 * @route DELETE /api/subjects/:id
 * @access Private (Admin)
 */
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    const { id, role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    await subject.deleteOne();
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
