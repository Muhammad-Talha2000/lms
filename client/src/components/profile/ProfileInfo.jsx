// components/profile/ProfileInfo.jsx
import React from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaMobileAlt,
  FaShareAlt,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import LocationComponent from "../LocationComponent";

import { Card } from "@/components/ui/card";

const ProfileInfo = ({ user, handleEditProfile, isLoading }) => {
  return (
    <Card className="w-full min-w-0 border-2 border-l-0 rounded-lg p-4 sm:p-6 bg-card shadow-sm">
      {/* Profile Image */}
      <div className="flex  flex-col items-center">
        <img
          src={user?.profileImage}
          alt="Profile"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <hr className="w-full border-t border-gray-300 mt-4 mb-4" />
      </div>

      {/* Details */}
      <div className="space-y-4">
        <InfoField
          icon={FaUserGraduate}
          label="Name"
          value={user?.name || "Not Available"}
        />

        <InfoField
          icon={FaEnvelope}
          label="Email"
          value={user?.email || "Not Available"}
        />

        {user?.address ? (
          <InfoField
            icon={FaLocationDot}
            label="Location"
            value={user.address}
          />
        ) : (
          <LocationComponent />
        )}

        <InfoField
          icon={FaMobileAlt}
          label="Mobile no"
          value={user?.mobile || "Not Available"}
        />
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6">
        <button
          onClick={handleEditProfile}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm sm:text-base text-primary bg-primary/10 rounded-lg font-semibold hover:bg-primary/15 disabled:opacity-50"
        >
          <FaShareAlt />
          {isLoading ? "Loading..." : "Edit Profile"}
        </button>
      </div>
    </Card>
  );
};

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0 min-w-0">
    <div className="flex items-center gap-2 shrink-0">
      <Icon className="text-primary h-4 w-4 shrink-0" />
      <span className="font-semibold text-foreground">{label}:</span>
    </div>
    <span className="text-muted-foreground break-words min-w-0 sm:ml-6">
      {value}
    </span>
  </div>
);

export default ProfileInfo;
