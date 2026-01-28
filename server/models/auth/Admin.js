import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const AdminSchema = new mongoose.Schema({
  systemLogs: [
    {
      type: String, // Logs or activity descriptions
    },
  ],
  settings: {
    type: Map, // System-wide settings
    of: String,
  },
});

// Use discriminator to inherit from BaseUser
const Admin = BaseUser.discriminator("Admin", AdminSchema);
export default Admin;
