// import express from "express";
// import axios from "axios";

// const router = express.Router();

// // Load AbhiPay API credentials from .env
// const ABHI_PAY_API_URL = process.env.ABHI_PAY_API_URL;
// const MERCHANT_ID = process.env.ABHI_PAY_MERCHANT_ID;
// const SECRET_KEY = process.env.ABHI_PAY_SECRET_KEY;

// // Payment Route - Handles transactions
// router.post("/pay", async (req, res) => {
//   try {
//     console.log(
//       "Payment request received:",
//       ABHI_PAY_API_URL,
//       MERCHANT_ID,
//       SECRET_KEY
//     );
//     const { amount, cardNumber, expiryDate, cvv, studentId, courseId } =
//       req.body;

//     // Build payment request payload
//     console.log(amount, cardNumber, expiryDate, cvv, studentId, courseId);
//     // const paymentData = {
//     //   // merchant_id: MERCHANT_ID,
//     //   // amount: amount,
//     //   // currency: "PKR",
//     //   // card_details: {
//     //   //   card_number: cardNumber,
//     //   //   expiry_date: expiryDate,
//     //   //   cvv: cvv,
//     //   // },
//     //   // metadata: {
//     //   //   studentId,
//     //   //   courseId,
//     //   // },
//     // };
//     const paymentData = {
//       merchant: MERCHANT_ID,
//       body: {
//         amount: amount,
//         language: "EN",
//         currencyType: "PKR",
//         description: "Test Payment",
//         approveURL: `http://localhost:5173/courseDetails/${courseId}`,
//         cancelURL: `http://localhost:5173/courseDetails/${courseId}`,
//         declineURL: `http://localhost:5173/courseDetails/${courseId}`,
//         uuid: studentId,
//         cardStorage: true,
//       },
//     };

//     // Send request to AbhiPay API
//     const response = await axios.post(ABHI_PAY_API_URL, paymentData, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: SECRET_KEY,

//         // Authorization: [SECRET_KEY],
//       },
//     });

//     console.log(response);

//     // Handle AbhiPay response
//     // if (response.data.status === "success") {
//     //   return res.json({
//     //     success: true,
//     //     message: "Payment successful!",
//     //     transactionId: response.data.transaction_id,
//     //   });
//     // } else {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Payment failed!",
//     //     error: response.data.message,
//     //   });
//     // }
//   } catch (error) {
//     console.error("Payment processing error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Payment processing error",
//       error: error.message,
//     });
//   }
// });

// export default router;

import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  confirmCheckoutSession,
  getAdminPaymentOverview,
} from "../controllers/paymentControllers.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticateUser,
  createCheckoutSession
);
router.post("/confirm-session", authenticateUser, confirmCheckoutSession);
/** Alias — same handler as Stripe checkout */
router.post("/pay", authenticateUser, createCheckoutSession);
router.get("/admin/overview", authenticateUser, getAdminPaymentOverview);

export default router;
