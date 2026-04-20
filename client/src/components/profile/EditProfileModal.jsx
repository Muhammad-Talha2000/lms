// components/profile/EditProfileModal.jsx
import React from "react";
import { createPortal } from "react-dom";
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
  React.useEffect(() => {
    if (!showModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 sm:items-center sm:p-4">
      <div className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-border px-4 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              Edit Profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your personal details and profile picture.
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close edit profile modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-5 rounded-xl border border-border/80 bg-muted/30 p-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Profile Image
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-background sm:h-20 sm:w-20">
                <img
                  src={formData.profileImage || "default-avatar.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
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
                className="inline-flex cursor-pointer items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Change Image
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="sm:col-span-2">
              <FormField
                icon={FaLocationArrow}
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <FormField
              icon={FaCalendar}
              name="dob"
              type="date"
              label="Date of Birth"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="border-t border-border bg-background/80 px-4 py-3 sm:px-6">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-lg bg-muted px-4 py-2.5 text-muted-foreground transition hover:bg-muted/80 sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
