import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClassService from "@/services/classService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "../Classes/SearchBar";
import ClassTable from "../Classes/ClassTable";
import ClassForm from "../Classes/ClassForm";
import DeleteDialog from "../Classes/DeleteDialog";
import { BookOpen, DollarSign, Sparkles } from "lucide-react";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    thumbnail: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useSelector((state) => state.auth.loggedinUser);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = classes.filter(
        (classItem) =>
          classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await ClassService.getClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      });
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let thumbnailUrl = formData.thumbnail || "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        thumbnail: thumbnailUrl,
      };

      if (isEditing) {
        await ClassService.updateClass(formData.id, payload, token);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        await ClassService.createClass(payload, token);
        toast({
          title: "Success",
          description: "Class created successfully",
        });
      }

      setIsFormModalOpen(false);
      resetForm();
      fetchClasses();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || `Error ${isEditing ? "updating" : "creating"} class`,
        variant: "destructive",
      });
      console.error(
        `Error ${isEditing ? "updating" : "creating"} class:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    setIsLoading(true);
    try {
      await ClassService.deleteClass(classToDelete._id, token);
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setClassToDelete(null);
      fetchClasses();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error deleting class",
        variant: "destructive",
      });
      console.error("Error deleting class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsFormModalOpen(true);
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
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const openDeleteDialog = (classItem) => {
    setClassToDelete(classItem);
    setIsDeleteDialogOpen(true);
  };

  const handleRowClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  const totalClasses = filteredClasses.length;
  const averagePrice =
    totalClasses > 0
      ? Math.round(
          filteredClasses.reduce(
            (sum, classItem) => sum + Number(classItem.price || 0),
            0
          ) / totalClasses
        )
      : 0;

  return (
    <>
      <div className="min-h-[60vh] w-full px-1 py-2 sm:px-2 sm:py-4">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <section className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50/70 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Admin workspace
              </div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Class Management
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Create, edit, and organize classes with quick access to pricing
                and details.
              </p>
            </div>
            <Button
              onClick={openCreateModal}
              className="h-11 rounded-xl bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600"
            >
              Create New Class
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Visible classes
                </p>
                <p className="text-xl font-bold text-gray-900">{totalClasses}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Average price
                </p>
                <p className="text-xl font-bold text-gray-900">Rs. {averagePrice}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Search scope
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Name and description
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <p className="text-sm text-gray-500">
              {filteredClasses.length} result
              {filteredClasses.length === 1 ? "" : "s"}
            </p>
          </div>

          <ClassTable
            classes={filteredClasses}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
            onRowClick={handleRowClick}
            isLoading={isLoading}
          />
        </section>
      </div>
      </div>
      {/* Unified Modal for Create and Edit */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isEditing ? "Edit Class" : "Create New Class"}
            </DialogTitle>
          </DialogHeader>
          <ClassForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isLoading}
            isEditing={isEditing}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            formKey={formData.id || "create"}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDelete={handleDeleteClass}
        itemToDelete={classToDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default ClassManagement;
