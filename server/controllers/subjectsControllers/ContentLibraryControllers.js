import Subjects from "../../models/Subjects.js";

export const addContent = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { name, url } = req.body;

    const subject = await Subjects.findById(subjectId).populate(
      "contentLibrary"
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newContent = { name, url };
    subject.contentLibrary.push(newContent);

    await subject.save();
    const addedContent = subject.contentLibrary[subject.contentLibrary.length - 1];
    return res.json({ message: "Content added successfully", content: addedContent });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export const editContent = async (req, res) => {
  try {
    const { subjectId, contentId } = req.params;
    const { name, url } = req.body;

    const subject = await Subjects.findById(subjectId).populate(
      "contentLibrary"
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const content = subject.contentLibrary.id(contentId);
    content.name = name;
    content.url = url;
    await subject.save();

    return res.json({ message: "Content updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { subjectId, contentId } = req.params;

    const subject = await Subjects.findById(subjectId).populate(
      "contentLibrary"
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.contentLibrary = subject.contentLibrary.filter(
      (content) => content._id.toString() !== contentId
    );

    await subject.save();
    return res.json({ message: "Content deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};
