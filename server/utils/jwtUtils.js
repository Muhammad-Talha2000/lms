import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY; 

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
