import express from "express";
import { scheduleLiveSessionController } from "../../controllers/subjectsControllers/SubjectMeeting.js";

const router = express.Router();

router.post("/:classId/:subjectId", scheduleLiveSessionController);

export default router;
