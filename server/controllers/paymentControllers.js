import Stripe from "stripe";
import Course from "../models/Courses.js";
import { completeStudentEnrollment } from "../services/studentEnrollmentService.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/$/, "");

const currency = (process.env.STRIPE_CURRENCY || "pkr").toLowerCase();

/**
 * Stripe Checkout — price is taken from the course document (not client body) to avoid tampering.
 */
export const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ error: "Stripe is not configured (STRIPE_SECRET_KEY)." });
    }

    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ error: "Only students can purchase courses." });
    }

    const { courseId, email } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required." });
    }

    const course = await Course.findById(courseId).select(
      "name price description"
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const priceNumber = Number(course.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      return res
        .status(400)
        .json({ error: "This course does not have a payable price." });
    }

    const unitAmount = Math.round(priceNumber * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: course.name,
              description:
                (course.description && String(course.description).slice(0, 500)) ||
                `Course enrollment`,
            },
          },
        },
      ],
      metadata: {
        userId: String(userId),
        courseId: String(courseId),
      },
      success_url: `${frontendUrl}/courseDetails/${courseId}?stripe_success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/courseDetails/${courseId}?stripe_cancel=1`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Checkout failed." });
  }
};

/**
 * After redirect from Stripe, client calls this with the session id to verify payment and enroll.
 */
export const confirmCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ error: "Stripe is not configured (STRIPE_SECRET_KEY)." });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can enroll." });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed." });
    }

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return res.status(400).json({ error: "Invalid checkout session." });
    }

    if (String(userId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ error: "This payment does not belong to your account." });
    }

    const result = await completeStudentEnrollment({
      courseId,
      studentId: userId,
      selectedSchedule: null,
    });

    if (!result.ok) {
      if (result.message === "Already enrolled in this course") {
        const existing = await Course.findById(courseId)
          .populate("enrolledStudents")
          .populate("instructor");
        return res.status(200).json({
          message: result.message,
          course: existing,
        });
      }
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({
      message: "Enrollment successful!",
      course: result.course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Confirmation failed." });
  }
};
