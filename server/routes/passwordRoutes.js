// // POST /api/forgot-password
// import express from "express";
// import {
//   forgotPassword,
//   resetPassword,
// } from "../controllers/passwordControllers.js";

// const router = express.Router();

// // Forgot password
// router.post("/", forgotPassword);
// // Reset password
// router.post("/reset-password", resetPassword);

// export default router;
import express from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordControllers.js";

const router = express.Router();

router.post("/", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
