import Student from "../models/auth/Student.js";
import Instructor from "../models/auth/Instructor.js";
import Admin from "../models/auth/Admin.js";
import Guardian from "../models/auth/Guardian.js";
import { hashPassword, verifyPassword } from "../utils/bcryptUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import Notification from "../models/Notification.js";

// Create User
export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    mobile,
    role,
    profileImage,
    dob,
    address,
    ...extraData
  } = req.body;
  console.log("📝 [AUTH] Register request:", { name, email, role });

  // Validate required fields
  if (!name || !email || !password || !role || !mobile) {
    console.error("❌ [AUTH] Missing required fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate role
  const validRoles = ["student", "instructor", "admin", "guardian"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if the email already exists (across all roles)
    const emailExists =
      (await Student.findOne({ email })) ||
      (await Instructor.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Guardian.findOne({ email }));

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Construct user object with common fields
    const userData = {
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      profileImage: profileImage || "", // Default empty string if no image
      dob: dob || null, // Default to null if not provided
      address: address || "", // Default to empty string if not provided
      status: role === "instructor",
      ...extraData,
    };

    let newUser;
    switch (role) {
      case "student":
        newUser = new Student(userData);
        break;
      case "instructor":
        newUser = new Instructor(userData);
        break;
      case "admin":
        newUser = new Admin(userData);
        break;
      case "guardian":
        newUser = new Guardian(userData);
        break;
    }

    // Save user to the database
    await newUser.save();

    const notification = new Notification({
      message: `A new  "${role}" registered ${name} ${email}.`,
      type: "User Registration",
    });

    await notification.save();

    res.status(201).json({
      message: `${role} created successfully`,
      user: { name, email, role },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userIP = req.headers["x-client-ip"];
  // console.log(userIP);

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check all role collections for the user
    const user =
      (await Student.findOne({ email })) ||
      (await Instructor.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Guardian.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === false) {
      return res
        .status(403)
        .json({ message: "Your account is not active till yet." });
    }

    // **Check if the user is already logged in from a different IP**
    if (user.loggedInIP && user.loggedInIP !== userIP) {
      return res
        .status(403)
        .json({ message: "You are already logged in from another IP." });
    }

    // Generate a JWT token
    const token = generateToken({ id: user._id, role: user.role });

    // **Update the user's logged-in IP in the database**
    user.loggedInIP = userIP;
    await user.save();

    // console.log(user);

    const notification = new Notification({
      message: `A user "${email}" logedin role "${user.role}" .`,
      type: "Users Login",
    });

    await notification.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user,
      // user: {
      //   name: user.name,
      //   email: user.email,
      //   role: user.role,
      //   mobile: user.mobile,
      // },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Edit profile
export const editUser = async (req, res) => {
  const { id } = req.user;
  const { name, email, mobile, profileImage, address, dob, ...rest } = req.body;

  try {
    // Find the user in all role collections
    let user =
      (await Student.findById(id)) ||
      (await Instructor.findById(id)) ||
      (await Admin.findById(id)) ||
      (await Guardian.findById(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (profileImage) user.profileImage = profileImage;
    if (address) user.address = address;
    if (dob) user.dob = dob;

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        address: user.address,
        dob: user.dob,
        role: user.role,
        ...rest,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  const { id } = req.user;

  try {
    // Find the user in all role collections
    let user =
      (await Student.findById(id)) ||
      (await Instructor.findById(id)) ||
      (await Admin.findById(id)) ||
      (await Guardian.findById(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile (excluding password)
    res.status(200).json({
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const students = await Student.find({});
    const instructors = await Instructor.find({});
    const admins = await Admin.find({});
    const guardians = await Guardian.find({});

    const users = [
      ...students.map((user) => ({ ...user.toObject(), role: "student" })),
      ...instructors.map((user) => ({
        ...user.toObject(),
        role: "instructor",
      })),
      ...admins.map((user) => ({ ...user.toObject(), role: "admin" })),
      ...guardians.map((user) => ({ ...user.toObject(), role: "guardian" })),
    ];

    res.status(200).json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user =
      (await Student.findById(userId)) ||
      (await Instructor.findById(userId)) ||
      (await Admin.findById(userId)) ||
      (await Guardian.findById(userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the stored IP
    user.loggedInIP = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

export const toggleInstructorStatus = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Toggle the status
    instructor.status = !instructor.status; // Toggle status
    await instructor.save();

    res.status(200).json({
      message: "Instructor status toggled successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating instructor status",
        error: error.message,
      });
  }
};
