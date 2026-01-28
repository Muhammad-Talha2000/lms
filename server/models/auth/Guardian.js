import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const GuardianSchema = new mongoose.Schema({
  children: [
    {
      type: String, // User IDs of children being monitored
    },
  ],
});

// Use discriminator to inherit from BaseUser
const Guardian = BaseUser.discriminator("Guardian", GuardianSchema);
export default Guardian;
