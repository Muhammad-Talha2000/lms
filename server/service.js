import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import zoomRoutes from "./routes/liveMeetingRoutes.js";
import oneToOneMeetingRoutes from "./routes/oneToOneMeetingRoutes.js";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import notificationRoutes from "./routes/notificationRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import contentLibraryRoutes from "./routes/subjectRoutes/contentLibraryRoutes.js";
import lessonRoutes from "./routes/subjectRoutes/lessonRoutes.js";
import assignmentRoutes from "./routes/subjectRoutes/assignmentsRoutes.js";
import quizRoutes from "./routes/subjectRoutes/quizzessRoutes.js";
import meetingRoutes from "./routes/subjectRoutes/subjectMeetingsRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware — allow local dev (Vite / CRA) and optional production origins
const corsOriginsEnv = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "";
const corsAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://lms-corporateprism.vercel.app",
  ...corsOriginsEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];
const corsOriginSet = new Set(corsAllowedOrigins);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(hpp());
app.use("/api", apiLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (corsOriginSet.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Client-IP",
      "Accept",
      "timezone",
    ],
    credentials: true,
  })
);

// additional comment
app.use(bodyParser.json());
app.set("trust proxy", true);

// Global request logging middleware with response codes
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`\n🔹 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📨 Body:", JSON.stringify(req.body).substring(0, 100) + "...");
  }

  // Capture response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? "❌" : statusCode >= 300 ? "⚠️" : "✅";
    console.log(`${statusEmoji} Response [${statusCode}] - Duration: ${duration}ms`);
    
    // Show response body only if there's an error (status >= 400)
    if (statusCode >= 400 && data && typeof data === "object") {
      console.log("📤 Error Response:", JSON.stringify(data));
    }
    return originalJson.call(this, data);
  };

  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/zoom", zoomRoutes);
app.use("/api/v1/one-to-one-meetings", oneToOneMeetingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/announcement", announcementRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/password", passwordRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/blogs", blogRoutes);

// Subject Routes
app.use("/api/v1/content", contentLibraryRoutes);
app.use("/api/v1/lesson", lessonRoutes);
app.use("/api/v1/assignment", assignmentRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/meeting", meetingRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // email service
  auth: {
    user: "codequesolutions@gmail.com",
    pass: "ugth rahy zxeu bmct",
  },
});

// Route to handle form submission
app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "smartflowtechofficial@gmail.com", // Replace with the recipient's email
    subject: `Contact Form Submission: ${subject}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ success: false, message: "Email failed to send." });
    }
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  });
});

const PORT = process.env.PORT || 5000;
// Vercel serverless provides the handler via default export; do not bind a port there.
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}✅✅✅`));
}

export default app;
