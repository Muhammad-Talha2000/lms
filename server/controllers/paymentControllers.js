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

const toPlainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
    const plainDescription = toPlainText(course.description);

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
                (plainDescription && plainDescription.slice(0, 500)) ||
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

/**
 * Admin payments dashboard data using enrollment records in DB.
 * This is a best-effort overview when no dedicated payment ledger exists.
 */
export const getAdminPaymentOverview = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admins only." });
    }

    const courses = await Course.find({})
      .select("name price enrolledStudents instructor updatedAt")
      .populate("enrolledStudents", "name email")
      .populate("instructor", "name");

    const transactions = [];
    let totalRevenue = 0;

    courses.forEach((course) => {
      const price = Number(course.price) || 0;
      const students = course.enrolledStudents || [];
      students.forEach((student) => {
        totalRevenue += price;
        transactions.push({
          id: `${course._id}-${student._id}`,
          courseId: String(course._id),
          courseName: course.name || "Untitled course",
          studentId: String(student._id),
          studentName: student.name || "Unknown student",
          studentEmail: student.email || "",
          instructorName: course.instructor?.name || "Unknown instructor",
          amount: price,
          currency: currency.toUpperCase(),
          status: "paid",
          createdAt: course.updatedAt || new Date(),
        });
      });
    });

    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalTransactions = transactions.length;
    const averageOrderValue =
      totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    return res.status(200).json({
      summary: {
        totalTransactions,
        totalRevenue,
        averageOrderValue,
        coursesWithSales: courses.filter(
          (course) => (course.enrolledStudents || []).length > 0
        ).length,
      },
      recentTransactions: transactions.slice(0, 50),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch payment overview." });
  }
};
