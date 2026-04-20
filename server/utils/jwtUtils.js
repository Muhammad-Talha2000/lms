import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
