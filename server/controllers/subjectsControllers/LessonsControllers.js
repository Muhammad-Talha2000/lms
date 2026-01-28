import Subjects from "../../models/Subjects.js";

export const addLesson = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, content } = req.body;

    const subject = await Subjects.findById(subjectId).populate("lessons");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newLesson = { title, content };
    subject.lessons.push(newLesson);

    await subject.save();
    const addedLesson = subject.lessons[subject.lessons.length - 1];
    return res.json({ message: "Lesson added successfully", lesson: addedLesson });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const editLesson = async (req, res) => {
  try {
    const { subjectId, lessonId } = req.params;
    const { title, content } = req.body;

    const subject = await Subjects.findById(subjectId).populate("lessons");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const lesson = subject.lessons.id(lessonId);

    lesson.title = title;
    lesson.content = content;
    await subject.save();

    return res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { subjectId, lessonId } = req.params;

    const subject = await Subjects.findById(subjectId).populate("lessons");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.lessons = subject.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );

    await subject.save();
    return res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};
