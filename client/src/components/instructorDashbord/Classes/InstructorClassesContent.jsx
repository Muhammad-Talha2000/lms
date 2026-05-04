import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ClassService from "@/services/classService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import SearchBar from "@/components/Classes/SearchBar";
import ClassForm from "@/components/Classes/ClassForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Pencil, Users } from "lucide-react";

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
      <div className="mb-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50/60 p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">
          My classes
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl">
          Classes where you are assigned as an instructor on at least one
          subject. Open a class to manage subjects and use edit to update class
          details.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Loading your classes...
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 p-10 text-center shadow-sm">
          <p className="text-base font-medium text-gray-700">
            No classes found for this search.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try another keyword or clear search input.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((classItem) => (
            <article
              key={classItem._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => navigate(`/class/${classItem._id}`)}
                className="block w-full text-left"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  {classItem.thumbnail ? (
                    <img
                      src={classItem.thumbnail}
                      alt={classItem.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                    {classItem.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {classItem.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                    <span className="font-semibold text-orange-600">
                      ${Number(classItem.price || 0)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <Users className="h-4 w-4" />
                      {classItem.students?.length || 0}
                    </span>
                  </div>
                </div>
              </button>
              <div className="px-4 pb-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50"
                  onClick={() => openEditModal(classItem)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit class
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

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
