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
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "../Classes/SearchBar";
import ClassTable from "../Classes/ClassTable";
import ClassForm from "../Classes/ClassForm";
import DeleteDialog from "../Classes/DeleteDialog";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
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
      id: null,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        await ClassService.updateClass(
          formData.id,
          {
            name: formData.name,
            description: formData.description,
            price: formData.price,
          },
          token
        );
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        await ClassService.createClass(
          {
            name: formData.name,
            description: formData.description,
            price: formData.price,
          },
          token
        );
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
    setFormData({
      id: classItem._id,
      name: classItem.name,
      description: classItem.description,
      price: classItem.price,
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

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center text-gray-800 border-b pb-3">
          Class Management
        </h2>

        <div className="flex justify-between items-center mb-6">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <Button
            onClick={openCreateModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            Create New Class
          </Button>
        </div>

        <ClassTable
          classes={filteredClasses}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />
      </div>

      {/* Unified Modal for Create and Edit */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
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
    </div>
  );
};

export default ClassManagement;
