// import React from "react";
// import { useSelector } from "react-redux";
// import {
//   FaUserGraduate,
//   FaEnvelope,
//   FaMobileAlt,
//   FaShareAlt,
//   FaTimes,
//   FaLocationArrow,
//   FaCalendar,
// } from "react-icons/fa";
// import { getUserProfile } from "@/services/authService";
// import LocationComponent from "../LocationComponent";
// import { Input } from "../ui/input";
// import { BsPerson } from "react-icons/bs";
// import { TfiEmail } from "react-icons/tfi";

// const PersonalDetails = () => {
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [showModal, setShowModal] = React.useState(false);
//   const [profileData, setProfileData] = React.useState(null);
//   const [error, setError] = React.useState("");
//   const { loggedinUser } = useSelector((state) => state.auth);

//   const handleEditProfile = async () => {
//     if (!loggedinUser?.token) {
//       setError("Please login to edit your profile");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const data = await getUserProfile(loggedinUser.token);

//       if (data && data.user) {
//         setProfileData(data.user);
//         setShowModal(true);
//       } else {
//         setError("Unable to fetch profile data");
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//       setError("Network error. Please check your connection");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="bg-white border-2 border-l-0 rounded-lg p-6 h-full">
//         {/* Profile Image */}
//         <div className="flex flex-col items-center">
//           <img
//             src={loggedinUser?.user.profileImage}
//             alt="Profile"
//             className="w-20 h-20 rounded-full mb-4"
//           />
//           <h3 className="text-lg font-semibold">Personal Details</h3>
//           <hr className="w-full border-t border-gray-300 mt-4 mb-4" />
//         </div>
//         {/* Details */}
//         <div className="space-y-4">
//           <div className="flex items-center gap-4">
//             <FaUserGraduate className="text-orange-500" />
//             <span className="font-semibold">Student:</span>
//             <span>{loggedinUser?.user?.name || "Mujahid Hussain"}</span>
//           </div>

//           <div className="flex items-center gap-4 border-t border-gray-300 pt-4">
//             <FaEnvelope className="text-orange-500" />
//             <span className="font-semibold">Email:</span>
//             <span>{loggedinUser?.user?.email || "mujahid@gmail.com"}</span>
//           </div>

//           {loggedinUser?.user.address ? (
//             <div className="flex items-center gap-4 border-t border-gray-300 pt-4">
//               <FaEnvelope className="text-orange-500" />
//               <span className="font-semibold">Location:</span>
//               <span>{loggedinUser?.user.address}</span>
//             </div>
//           ) : (
//             <LocationComponent />
//           )}

//           <div className="flex items-center gap-4 border-t border-gray-300 pt-4">
//             <FaMobileAlt className="text-orange-500" />
//             <span className="font-semibold">Mobile no:</span>
//             <span>{loggedinUser?.user?.mobile || "0345-1234567"}</span>
//           </div>
//         </div>
//         {/* Error Message */}
//         {/* {error && (
//           <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
//         )} */}
//         {/* Edit Profile Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleEditProfile}
//             disabled={isLoading}
//             className="flex items-center justify-center gap-2 w-full px-4 py-2 text-orange-500 bg-orange-100 rounded-lg font-semibold hover:bg-orange-200 disabled:opacity-50"
//           >
//             <FaShareAlt />
//             {isLoading ? "Loading..." : "Edit Profile"}
//           </button>
//         </div>
//       </div>

//       {/* Basic Modal */}

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <FaTimes />
//             </button>

//             {/* Modal Content */}
//             <div className="mt-2">
//               <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

//               {profileData && (
//                 <div className="space-y-4">
//                   {/* Profile Image Upload */}
//                   <div className="relative">
//                     <label
//                       htmlFor="profile-image"
//                       className="block text-sm font-semibold mb-1"
//                     >
//                       Profile Image
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
//                         <img
//                           src={profileData.profileImage || "default-avatar.png"}
//                           alt="Profile"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <input
//                         id="profile-image"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageUpload(e)}
//                       />
//                       <label
//                         htmlFor="profile-image"
//                         className="text-sm text-blue-500 cursor-pointer hover:underline"
//                       >
//                         Change Image
//                       </label>
//                     </div>
//                   </div>

//                   {/* Name Field */}
//                   <div className="relative">
//                     <Input
//                       id="name"
//                       type="text"
//                       value={profileData.name}
//                       label="Name"
//                       placeholder="Name"
//                     />
//                     <BsPerson className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   {/* Email Field */}
//                   <div className="relative">
//                     <Input
//                       id="email"
//                       type="email"
//                       name="email"
//                       value={profileData.email}
//                       label="Email"
//                       placeholder="Email"
//                     />
//                     <TfiEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   {/* Mobile Field */}
//                   <div className="relative">
//                     <Input
//                       id="mobile"
//                       type="text"
//                       name="mobile"
//                       value={profileData.mobile}
//                       label="Mobile"
//                       placeholder="Mobile"
//                     />
//                     <FaMobileAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   {/* Role Field (Read-only) */}
//                   <div className="relative">
//                     <Input
//                       id="role"
//                       type="text"
//                       name="role"
//                       value={profileData.role}
//                       label="Role"
//                       placeholder="Role"
//                       readOnly
//                     />
//                     <FaUserGraduate className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   {/* Address Field */}
//                   <div className="relative">
//                     <Input
//                       id="address"
//                       type="text"
//                       name="address"
//                       value={profileData.address}
//                       label="Address"
//                       placeholder="Address"
//                     />
//                     <FaLocationArrow className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>

//                   {/* Date of Birth (DOB) Field */}
//                   <div className="relative">
//                     <Input
//                       id="dob"
//                       type="date"
//                       name="dob"
//                       value={profileData.dob}
//                       label="Date of Birth"
//                       placeholder="Date of Birth"
//                     />
//                     <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>
//                 </div>
//               )}

//               {/* Modal Buttons */}
//               <div className="mt-6 flex justify-end gap-4">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     // Handle save changes here
//                     setShowModal(false);
//                   }}
//                   className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PersonalDetails;

// components/profile/PersonalDetails.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, editProfile } from "@/services/authService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import ProfileInfo from "./ProfileInfo";
import EditProfileModal from "./EditProfileModal";
import { setLoggedinUser } from "@/redux/authSlice";

const PersonalDetails = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [profileData, setProfileData] = React.useState(null);
  const [error, setError] = React.useState("");
  const { loggedinUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
    profileImage: "",
    role: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData({
        ...formData,
        profileImage: imageUrl,
      });
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!loggedinUser?.token) {
      setError("Please login to edit your profile");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await getUserProfile(loggedinUser.token);
      if (data && data.user) {
        setProfileData(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          address: data.user.address || "",
          dob: data.user.dob || "",
          profileImage: data.user.profileImage || "",
          role: data.user.role || "",
        });
        setShowModal(true);
      }
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveChanges = async () => {
  //   try {
  //     setIsLoading(true);
  //     await editProfile(loggedinUser.token, formData);
  //     const updatedData = await getUserProfile(loggedinUser.token);
  //     setProfileData(updatedData.user);
  //     setShowModal(false);
  //   } catch (error) {
  //     setError("Failed to update profile");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      // Update profile
      await editProfile(loggedinUser.token, formData);

      // Get updated data
      const updatedData = await getUserProfile(loggedinUser.token);

      // Update Redux state with new user data
      dispatch(
        setLoggedinUser({
          token: loggedinUser.token,
          user: updatedData.user,
        })
      );

      // Update local state
      setProfileData(updatedData.user);
      setShowModal(false);
    } catch (error) {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProfileInfo
        user={loggedinUser?.user}
        handleEditProfile={handleEditProfile}
        isLoading={isLoading}
      />

      <EditProfileModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageUpload={handleImageUpload}
        handleSaveChanges={handleSaveChanges}
        isLoading={isLoading}
      />
    </>
  );
};

export default PersonalDetails;
