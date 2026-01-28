import express from "express";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

// Route to get all notifications
router.get("/", getNotifications);

export default router;