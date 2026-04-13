import ClassService from "@/services/classService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import ClassForm from "./ClassForm";
import SubjectsList from "./SubjectsList";
import StudentsList from "./StudentsList";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ClassDetails = () => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const { toast } = useToast();
  const { loggedinUser } = useSelector((state) => state.auth);
  const token = loggedinUser?.token;
  const navigate = useNavigate();
  const role = loggedinUser?.user?.role;
  const userId = loggedinUser?.user?._id?.toString();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    thumbnail: "",
    id: null,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const isEnrolled = classDetails?.students?.some(
    (student) =>
      student?._id?.toString() === loggedinUser?.user?._id?.toString()
  );

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
    }
    fetchClassDetails();
  }, [id]);

  const handleEnrollment = async () => {
    try {
      await ClassService.enrollStudentInClass(id, loggedinUser?.token);
      const response = await ClassService.getClassById(id);
      setClassDetails(response);
      setSubjects(response.subjects || []);
      toast({
        title: "Success!",
        description: `You are now enrolled in class ${classDetails.name} `,
        variant: "success",
      });
    } catch (error) {
      console.log("Failed to enroll");
      toast({
        title: "Error!",
        description: `Failed to  enrolled in class ${classDetails.name} `,
        variant: "destructive",
      });
    }
  };

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      // Fetch class details by id
      const response = await ClassService.getClassById(id);
      console.log(response);

      setClassDetails(response);
      setSubjects(response.subjects || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError("Failed to load class details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const canEditClass =
    !!classDetails &&
    !!token &&
    (role === "admin" ||
      (role === "instructor" &&
        (classDetails.subjects || []).some((s) => {
          const inst = s.instructor?._id ?? s.instructor;
          return inst?.toString() === userId;
        })));

  const openEditClassModal = () => {
    if (!classDetails) return;
    setThumbnailFile(null);
    setEditFormData({
      id: classDetails._id,
      name: classDetails.name,
      description: classDetails.description,
      price: classDetails.price,
      thumbnail: classDetails.thumbnail || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditClassSubmit = async (e) => {
    e.preventDefault();
    if (!classDetails?._id || !token) return;
    setFormSubmitting(true);
    try {
      let thumbnailUrl = editFormData.thumbnail || "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);
      }
      const updated = await ClassService.updateClass(
        classDetails._id,
        {
          name: editFormData.name,
          description: editFormData.description,
          price: editFormData.price,
          thumbnail: thumbnailUrl,
        },
        token
      );
      setClassDetails(updated);
      setSubjects(updated.subjects || []);
      setIsEditModalOpen(false);
      setThumbnailFile(null);
      toast({
        title: "Saved",
        description: "Class details were updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Could not update class.",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const refreshSubjects = async () => {
    try {
      const response = await ClassService.getClassById(id);
      setSubjects(response.subjects || []);
      setClassDetails((prevDetails) => ({
        ...prevDetails,
        subjects: response.subjects || [],
      }));
    } catch (error) {
      console.error("Error refreshing subjects:", error);
      toast({
        title: "Error",
        description: "Failed to refresh subjects.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-16 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm font-medium">Loading class…</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-red-800 break-words">
            {error}
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!classDetails) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-4xl px-4 py-10 text-center text-gray-600">
          No class details found.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-5xl min-w-0 overflow-x-hidden px-3 pb-12 sm:px-5 box-border">
        {canEditClass ? (
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-orange-200 bg-white text-gray-800 hover:bg-orange-50"
              onClick={openEditClassModal}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit class
            </Button>
          </div>
        ) : null}
        <ClassHeader
          name={classDetails.name}
          description={classDetails.description}
          thumbnail={classDetails.thumbnail}
        />

        {role === "student" &&
          ((classDetails?.students || []).some(
            (student) =>
              student?._id?.toString() === loggedinUser?.user?._id?.toString()
          ) ? (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-3 text-emerald-900 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </span>
              <p className="text-sm font-medium sm:text-base">
                You&apos;re enrolled in this class as a student.
              </p>
            </div>
          ) : (
            <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-sm text-gray-600">
                Enroll to access subjects and learning materials.
              </p>
              <Button
                onClick={handleEnrollment}
                className="h-11 shrink-0 rounded-xl bg-orange-500 px-6 hover:bg-orange-600 w-full sm:w-auto"
              >
                Enroll now
              </Button>
            </div>
          ))}

        <SubjectsList
          subjects={classDetails.subjects || []}
          classId={id}
          refreshSubjects={refreshSubjects}
          isEnrolled={isEnrolled}
        />

        {role && role !== "student" && (
          <StudentsList students={classDetails.students || []} />
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit class</DialogTitle>
            </DialogHeader>
            <ClassForm
              formData={editFormData}
              setFormData={setEditFormData}
              onSubmit={handleEditClassSubmit}
              onCancel={() => setIsEditModalOpen(false)}
              isLoading={formSubmitting}
              isEditing
              thumbnailFile={thumbnailFile}
              setThumbnailFile={setThumbnailFile}
              formKey={editFormData.id || "class-edit"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DefaultLayout>
  );
};

export default ClassDetails;
