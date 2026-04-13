import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Save, Edit } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SubjectService from "@/services/subjectService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { useToast } from "@/hooks/use-toast";

const DetailView = ({ subject }) => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const role = loggedinUser?.user?.role || "student";
  const token = loggedinUser?.token;

  const [isEditing, setIsEditing] = useState(false);
  const [updatedSubject, setUpdatedSubject] = useState(subject);
  const [isLoading, setIsLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    setUpdatedSubject({ ...updatedSubject, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setUpdatedSubject({ ...updatedSubject, thumbnail: imageUrl });
      setFileToUpload(file);
    }
  };

  // Remove thumbnail
  const removeThumbnail = (e) => {
    e.stopPropagation();
    setUpdatedSubject({ ...updatedSubject, thumbnail: "" });
    setFileToUpload(null);
  };

  // Handle description change
  const handleDescriptionChange = (value) => {
    setUpdatedSubject({ ...updatedSubject, description: value });
  };

  // Cancel editing
  const handleCancel = () => {
    setUpdatedSubject(subject);
    setIsEditing(false);
    setFileToUpload(null);
  };

  // Save changes (Admin Only)
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!updatedSubject.name?.trim()) {
        toast({
          title: "Missing information",
          description: "Subject name is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Upload new image if exists
      let subjectToUpdate = { ...updatedSubject };
      if (fileToUpload) {
        const cloudinaryUrl = await uploadImageToCloudinary(fileToUpload);
        subjectToUpdate.thumbnail = cloudinaryUrl;
      }

      // Call API to update subject
      await SubjectService.updateSubject(subject._id, subjectToUpdate, token);

      toast({
        title: "Subject updated",
        description: "Subject details have been updated successfully",
      });

      setIsEditing(false);
      setFileToUpload(null);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Error updating subject",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!subject) return <p>Loading...</p>;

  const canEdit = role === "admin";
  const canViewInstructor = role === "admin" || role === "student";

  return (
    <div className="min-w-0 max-w-full">
      <div className="border-b border-gray-100 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 text-xl font-bold leading-tight text-gray-800 sm:text-2xl break-words">
            {isEditing ? (
              <Input
                name="name"
                value={updatedSubject.name}
                onChange={handleInputChange}
                className="w-full focus:border-orange-500 focus:ring-orange-500"
                placeholder="Subject Name"
              />
            ) : (
              subject.name
            )}
          </div>
          {canEdit && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full shrink-0 bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-5 py-4 sm:space-y-6 sm:py-6">
        {/* Thumbnail */}
        <div className="mb-6 w-full">
          <Label className="text-sm font-medium text-gray-600 mb-2 block">
            Thumbnail
          </Label>
          {role === "admin" && isEditing ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 mt-2 text-center cursor-pointer ${
                updatedSubject.thumbnail
                  ? "border-orange-200 bg-orange-50"
                  : "border-gray-300 hover:border-orange-500 hover:bg-orange-50"
              }`}
              onClick={() =>
                document.getElementById("thumbnail-upload").click()
              }
            >
              <input
                type="file"
                id="thumbnail-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              {updatedSubject.thumbnail ? (
                <div className="relative">
                  <button
                    onClick={removeThumbnail}
                    className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={updatedSubject.thumbnail}
                    alt="Thumbnail preview"
                    className=""
                  />
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden shadow-md">
              {subject.thumbnail ? (
                <img
                  src={subject.thumbnail}
                  alt={subject.name}
                  className="max-h-80 w-full object-cover"
                />
              ) : (
                <div className="bg-orange-50 h-48 flex items-center justify-center rounded-lg">
                  <p className="text-orange-300">No thumbnail</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-medium text-gray-600 mb-2 block">
            Description
          </Label>
          {role === "admin" && isEditing ? (
            <div className="mb-4">
              <ReactQuill
                value={updatedSubject.description}
                onChange={handleDescriptionChange}
                className="bg-white rounded-lg"
                theme="snow"
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          ) : (
            <div
              className="max-w-none overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed sm:text-base [&_*]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html:
                  subject.description || "<p>No description available.</p>",
              }}
            />
          )}
        </div>

        {/* Instructor Details - Only visible to admin and students */}
        {canViewInstructor && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">
              Instructor
            </Label>
            <p className="text-lg">
              {subject.instructor?.name || "Not Assigned"}
            </p>
            {subject.instructor?.email && (
              <p className="text-sm text-gray-600">
                {subject.instructor.email}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons (Only Admin Can Edit) */}
        {canEdit && isEditing && (
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">Saving...</div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
