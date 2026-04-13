// components/profile/EditProfileModal.jsx
import React from "react";
import { Input } from "../ui/input";
import { BsPerson } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import {
  FaUserGraduate,
  FaMobileAlt,
  FaLocationArrow,
  FaCalendar,
  FaTimes,
} from "react-icons/fa";

const EditProfileModal = ({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleImageUpload,
  handleSaveChanges,
  isLoading,
}) => {
  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
        <div className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-lg sm:rounded-2xl sm:p-6">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>

          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="space-y-4">
              {/* Profile Image Upload */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={formData.profileImage || "default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="profile-image"
                    className="text-sm text-blue-500 cursor-pointer hover:underline"
                  >
                    Change Image
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <FormField
                icon={BsPerson}
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
              />

              <FormField
                icon={TfiEmail}
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <FormField
                icon={FaMobileAlt}
                name="mobile"
                label="Mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />

              <FormField
                icon={FaUserGraduate}
                name="role"
                label="Role"
                value={formData.role}
                readOnly
              />

              <FormField
                icon={FaLocationArrow}
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
              />

              <FormField
                icon={FaCalendar}
                name="dob"
                type="date"
                label="Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-muted-foreground bg-muted rounded-lg hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2.5 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const FormField = ({
  icon: Icon,
  name,
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
}) => (
  <div className="relative">
    <Input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={label}
      readOnly={readOnly}
    />
    <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
);

export default EditProfileModal;
