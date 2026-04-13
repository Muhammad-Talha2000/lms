import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import ClassService from "@/services/classService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import SearchBar from "@/components/Classes/SearchBar";
import ClassTable from "@/components/Classes/ClassTable";
import ClassForm from "@/components/Classes/ClassForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InstructorClassesContent = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    thumbnail: "",
    id: null,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const { token } = useSelector((state) => state.auth.loggedinUser);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await ClassService.getClassesForInstructor(token);
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your classes.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  useEffect(() => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      setFilteredClasses(
        classes.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        )
      );
    } else {
      setFilteredClasses(classes);
    }
  }, [searchTerm, classes]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      thumbnail: "",
      id: null,
    });
    setThumbnailFile(null);
  };

  const openEditModal = (classItem) => {
    setThumbnailFile(null);
    setFormData({
      id: classItem._id,
      name: classItem.name,
      description: classItem.description,
      price: classItem.price,
      thumbnail: classItem.thumbnail || "",
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let thumbnailUrl = formData.thumbnail || "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);
      }
      await ClassService.updateClass(
        formData.id,
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          thumbnail: thumbnailUrl,
        },
        token
      );
      toast({ title: "Success", description: "Class updated successfully." });
      setIsFormModalOpen(false);
      resetForm();
      fetchClasses();
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
        My classes
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-2xl">
        Classes where you are assigned as an instructor on at least one subject.
        You can update the class name, description, price, and thumbnail.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <ClassTable
        classes={filteredClasses}
        onEdit={openEditModal}
        onRowClick={(classId) => navigate(`/class/${classId}`)}
        isLoading={isLoading}
        showDelete={false}
      />

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit class</DialogTitle>
          </DialogHeader>
          <ClassForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isLoading}
            isEditing
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            formKey={formData.id || "edit"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorClassesContent;
