// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { uploadImageToCloudinary } from "../services/cloudinaryService";
// import { register } from "../services/authService";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { setSignupData } from "@/redux/authSlice";
// import { useToast } from "@/hooks/use-toast";

// const PersonalDetails = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { signupData } = useSelector((state) => state.auth);
//   const { toast } = useToast();

//   const [profileImage, setProfileImage] = useState(
//     "https://via.placeholder.com/100x100.png?text=DP"
//   );
//   const [dob, setDob] = useState(null);
//   const [address, setAddress] = useState("");
//   const [role, setRole] = useState("student");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Handle Image Selection & Upload to Cloudinary
//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     try {
//       const imageUrl = await uploadImageToCloudinary(file);
//       setProfileImage(imageUrl);
//     } catch (err) {
//       setError("Failed to upload image.");
//     }
//     setLoading(false);
//   };

//   // Handle Final Registration
//   const handleSubmit = async () => {
//     if (!dob || !address || !profileImage || !role) {
//       setError("Please fill all details.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const finalUserData = {
//         ...signupData, // Get data from signup page
//         profileImage,
//         dob,
//         address,
//         role,
//       };

//       console.log("Final Registration Data:", finalUserData); // Debugging Log

//       await register(finalUserData);
//       dispatch(setSignupData(null));
//       toast({
//         title: "Success!",
//         description: "Signup successfully",
//         className: "bg-green-500 text-white",
//       });
//       navigate("/login"); // Redirect after successful signup
//     } catch (err) {
//       setError(err.message || "Registration failed.");
//       toast({
//         title: "Error!",
//         description: err.message || "Registration Failed",
//         className: "bg-red-500 text-white",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <div className="w-[500px] bg-white p-6 shadow-md rounded-md">
//         <h2 className="text-xl font-bold text-center mb-4">
//           Complete Your Profile
//         </h2>

//         {/* Profile Image Upload */}
//         <div className="mb-4 text-center">
//           <label htmlFor="profileUpload" className="cursor-pointer">
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-24 h-24 rounded-full mx-auto border"
//             />
//           </label>
//           <input
//             id="profileUpload"
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />
//         </div>

//         {/* Date of Birth */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">
//             Date of Birth
//           </label>
//           {/* <DatePicker
//             selected={dob}
//             onChange={(date) => setDob(date)}
//             className="w-full border p-2 rounded-md"
//             placeholderText="Select DOB"
//           /> */}

//           <Input
//             id="dob"
//             type="date"
//             name="dob"
//             value={dob}
//             onChange={(e) => setDob(e.target.value)}
//             placeholder="Date of Birth"
//           />
//         </div>

//         {/* Address */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Address</label>
//           <Input
//             type="text"
//             placeholder="Enter Address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />
//         </div>

//         {/* Role */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium text-center">
//             Are you?
//           </label>
//           <div className="flex gap-4 mt-2 justify-center w-full">
//             {/* Student Button */}
//             <button
//               className={`px-4 py-2 rounded-lg font-medium ${
//                 role === "student"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//               onClick={() => setRole("student")}
//             >
//               Student
//             </button>

//             {/* Instructor Button */}
//             <button
//               className={`px-4 py-2 rounded-lg font-medium ${
//                 role === "instructor"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//               onClick={() => setRole("instructor")}
//             >
//               Instructor
//             </button>
//           </div>

//           {/* Display the selected role */}
//           {role && (
//             <p className="mt-4 text-sm text-gray-600">
//               Selected role: <span className="font-bold">{role}</span>
//             </p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <Button
//           className="w-full bg-orange-500 text-white hover:bg-orange-600 font-bold"
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save & Register"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PersonalDetails;

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/cloudinaryService";
import { register } from "../services/authService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData } from "@/redux/authSlice";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaCamera } from "react-icons/fa";

const PersonalDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    profileImage: null,
    dob: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
      // toast({
      //   title: "Success!",
      //   description: "Profile image uploaded successfully",
      //   className: "bg-green-500 text-white",
      // });
    } catch (err) {
      toast({
        title: "Error!",
        description: "Failed to upload image",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.dob || !formData.address || !formData.profileImage) {
      toast({
        title: "Error!",
        description: "Please fill all required fields",
        className: "bg-yellow-500 text-white",
      });
      return;
    }

    setLoading(true);
    try {
      const finalUserData = {
        ...signupData,
        ...formData,
      };

      console.log("from personal details page:", finalUserData);

      await register(finalUserData);
      toast({
        title: "Success!",
        description:
          signupData.role === "instructor"
            ? "Registered successfully. Your account will be acive soon"
            : "Registered successfully",
        className: "bg-green-500 text-white",
      });
      dispatch(setSignupData(null));
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error!",
        description: err.message || "Registration failed",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Add your personal details to complete registration
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Image Upload */}
          {/* <div className="flex flex-col items-center space-y-4">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
            >
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaCamera className="w-8 h-8 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">
              {formData.profileImage
                ? "Image uploaded successfully"
                : "Click to upload profile picture"}
            </p>
          </div> */}

          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
            >
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaCamera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">
              {formData.profileImage
                ? "Image uploaded successfully"
                : "Click to upload profile picture"}
            </p>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your address"
                required
              />
            </div>
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Registration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDetails;
