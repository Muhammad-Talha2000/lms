import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/auth/BaseUser.js";
import dotenv from "dotenv";
dotenv.config();

// POST /api/forgot-password
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(200).json({
//         message:
//           "If an account with that email exists, you will receive an email with instructions.",
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     // Store token and expiry
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();
//     console.log("Token saved:", resetToken);

//     // Reset link
//     const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`;

//     // Email transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset",
//       text: `You requested a password reset.\n\nClick the link to reset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       message:
//         "If an account with that email exists, you will receive an email with instructions.",
//     });
//   } catch (error) {
//     console.error("Error in forgot password:", error);
//     res.status(500).json({ message: "Error sending email" });
//   }
// };

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("Token saved:", resetToken);

    // Reset link
    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBaseUrl.replace(/\/$/, "")}/resetPassword/${resetToken}`;

    // Email transporter
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
      subject: "Password Reset",
      text: `You requested a password reset.\n\nClick the link to reset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

// POST /api/reset-password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Find the user with the token that is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    console.log("Old password:", user.password); // Debugging

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    console.log("New hashed password:", hashedPassword); // Debugging

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log("Password updated successfully!"); // Debugging

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
