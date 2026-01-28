import nodemailer from "nodemailer";

let verificationCodes = {}; // Store verification codes temporarily

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log("📧 [OTP] Sending OTP request for email:", email);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  // Store code and expiration time
  verificationCodes[email] = { code, expiresAt: expirationTime };
  console.log("🔐 [OTP] Generated code:", code);

  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Alert for Registration",
    text: `Dear user,\n \nYour One Time Password (OTP) has been generated upon request for User Registration.Your verification code is: ${code}, that can be used only once and it is valid for next 5 minutes.\n For your own security, please do not share this OTP with anyone.\n\nThank you,\nTeam LMS`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ [OTP] Email sent successfully to:", email);
    res.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("❌ [OTP] Failed to send email:", error.message);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, code } = req.body;

  // Check if OTP code is provided
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "OTP code is required.",
    });
  }

  // Check if OTP exists
  if (!verificationCodes[email]) {
    return res.status(400).json({
      success: false,
      message: "OTP not found. Please request a new one.",
      action: "resend",
    });
  }

  const { code: storedCode, expiresAt } = verificationCodes[email];

  // Check if OTP is expired
  if (Date.now() > expiresAt) {
    delete verificationCodes[email]; // Remove expired OTP
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
      action: "resend",
    });
  }

  // Check if OTP is correct
  if (storedCode !== code) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code.",
    });
  }

  // OTP is correct - proceed with login
  delete verificationCodes[email]; // Remove OTP after successful verification
  return res.json({ success: true, message: "Login successful!" });
};
