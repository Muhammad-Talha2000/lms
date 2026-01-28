import Announcement from "../models/Announcements.js";
import Course from "../models/Courses.js";

// Create a new announcement and push it to a course's announcements array
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { courseId } = req.params;
    const { id, role } = req.user;

    // validating only instructor can create announcement
    if (!id && role !== "instructor")
      return res
        .status(403)
        .json({ message: "Only valid instructors can create announcement" });

    // Create the announcement
    const announcement = new Announcement({ title, message });
    await announcement.save();

    // If a courseId is provided, update the corresponding course document
    if (courseId) {
      // Find the course by its ID
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      // Push the new announcement's ID into the announcements array
      course.announcements.push(announcement._id);
      await course.save();
    }

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("announcements");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course.announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, message } = req.body;
    const { id, role } = req.user;

    // Validate that only an instructor can update announcements
    if (!id || role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only valid instructors can update announcements" });
    }

    // Find the announcement and update it
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Update the fields
    announcement.title = title || announcement.title;
    announcement.message = message || announcement.message;

    // Save the updated announcement
    await announcement.save();

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId, courseId } = req.params;
    const { id, role } = req.user;

    // Validate that only an instructor can delete announcements
    if (!id || role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only valid instructors can delete announcements" });
    }

    // Find the announcement
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // If courseId is provided, remove the announcement reference from the course
    if (courseId) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Remove the announcement ID from the course's announcements array
      course.announcements = course.announcements.filter(
        (id) => id.toString() !== announcementId
      );

      await course.save();
    }

    // Delete the announcement document
    await Announcement.findByIdAndDelete(announcementId);

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
