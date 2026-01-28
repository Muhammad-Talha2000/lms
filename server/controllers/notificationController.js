
import Notification from "../models/Notification.js"
export const createNotification = async (type, message) => {
  try {
    const notification = new Notification({ type, message });
    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Get all notifications (for Admin)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
