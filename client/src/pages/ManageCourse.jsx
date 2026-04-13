import React, { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "@/services/courseService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import DefaultLayout from "@/components/layout/DefaultLayout";
import CourseSidebar from "@/components/instructorDashbord/Course/CourseSidebar";
import CourseForm from "@/components/instructorDashbord/Course/CourseForm";
import { useSelector } from "react-redux";
import DetailedCardView from "@/components/instructorDashbord/Course/DetailedCardView";
import EditCardModal from "@/components/instructorDashbord/Course/EditCardModal";
import { useToast } from "@/hooks/use-toast";
import DiscussionBox from "@/components/coure details/Discussion box/DiscussionBox";
import Announcements from "@/components/instructorDashbord/Course/Announcements";

const ManageCourse = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();
  const { loggedinUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const [course, setCourse] = useState({
    name: "",
    description: "",
    thumbnail: "",
    price: 0,
    duration: "",
    language: "",
    courseLevel: "",
    tags: [],
    contentLibrary: [],
    lessons: [],
    assignments: [],
    quizzes: [],
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [view, setView] = useState("form");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mobileCourseNavOpen, setMobileCourseNavOpen] = useState(false);

  const closeMobileCourseNav = useCallback(() => {
    setMobileCourseNavOpen(false);
  }, []);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
      } catch (error) {
        setError("Failed to fetch course details");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    if (!mobileCourseNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileCourseNavOpen]);
  // ===========================================================
  // Handle form Input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ===========================================================
  // handle thumbnail
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      const url = await uploadImageToCloudinary(file);
      setCourse((prev) => ({
        ...prev,
        thumbnail: url,
      }));
    } catch (uploadError) {
      setError("Failed to upload image");
      console.error("Image upload error:", uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const removeThumbnail = () => {
    setCourse((prev) => ({
      ...prev,
      thumbnail: "",
    }));
  };
  // ===========================================================
  //  handle description change
  const handleDescriptionChange = (value) => {
    setCourse((prev) => ({
      ...prev,
      description: value,
    }));
  };
  // ===========================================================
  // handle select change
  const handleSelectChange = (name, value) => {
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ===========================================================
  // On Card click
  const handleCardClick = (type, card) => {
    closeMobileCourseNav();
    setSelectedCard({ type, card });
    setView("detail");
  };
  // ===========================================================
  // back click
  const handleBackToForm = () => {
    setSelectedCard(null);
    setView("form");
  };

  const handleDiscussionClick = () => {
    closeMobileCourseNav();
    setView("discussion");
  };
  // ===========================================================
  //  handle delete course
  const handleDeleteCard = async (selectedCard) => {
    const { type, card } = selectedCard;

    // Create a new course object with the filtered arrays
    const updatedCourse = { ...course };

    switch (type) {
      case "quiz":
        updatedCourse.quizzes = course.quizzes.filter(
          (quiz) => quiz._id !== card._id
        );
        break;

      case "lesson":
        updatedCourse.lessons = course.lessons.filter(
          (lesson) => lesson._id !== card._id
        );
        break;

      case "assignment":
        updatedCourse.assignments = course.assignments.filter(
          (assignment) => assignment._id !== card._id
        );
        break;

      case "content":
        updatedCourse.contentLibrary = course.contentLibrary.filter(
          (content) => content._id !== card._id
        );
        break;

      default:
        return;
    }

    // Update the state with the new course object
    setCourse(updatedCourse);

    // Navigate back to form view
    handleBackToForm();

    try {
      // Optionally, update the course in the backend
      await updateCourse(updatedCourse, id, loggedinUser.token);
      toast({
        title: "Success!",
        description: `${
          card.title || card.name
        } has been successfully removed from ${type}.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Success!",
        description: `Failed to delete ${
          card.title || card.name
        } from ${type}.`,
        className: "bg-green-500 text-white",
      });
      console.error("Error updating course after deletion:", error);
      setError("Failed to update course after deletion");
    }
  };
  // ===========================================================
  // handle edit course
  const handleEditCard = (selectedCard) => {
    setSelectedCard(selectedCard);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedCard = (type, editedCard) => {
    setCourse((prevCourse) => {
      const updatedCourse = { ...prevCourse };

      switch (type) {
        case "content":
          updatedCourse.contentLibrary = prevCourse.contentLibrary.map(
            (content) => (content._id === editedCard._id ? editedCard : content)
          );
          break;
        case "lesson":
          updatedCourse.lessons = prevCourse.lessons.map((lesson) =>
            lesson._id === editedCard._id ? editedCard : lesson
          );
          break;
        case "assignment":
          updatedCourse.assignments = prevCourse.assignments.map((assignment) =>
            assignment._id === editedCard._id ? editedCard : assignment
          );
          break;
        case "quiz":
          updatedCourse.quizzes = prevCourse.quizzes.map((quiz) =>
            quiz._id === editedCard._id ? editedCard : quiz
          );
          break;
      }

      updateCourse(updatedCourse, id, loggedinUser.token)
        .then(
          toast({
            title: "Success!",
            description: `${
              editedCard.title || editedCard.name
            } has been successfully edited and successfully updated the course.`,
            className: "bg-green-500 text-white",
          })
        )
        .catch((error) => {
          console.error("Failed to update course", error);
        });

      handleBackToForm();

      return updatedCourse;
    });
  };
  // ===========================================================
  // Main save api
  const handleSaveChanges = async () => {
    try {
      await updateCourse(course, id, loggedinUser.token);
      toast({
        title: "Success!",
        description: "Successfully updated course",
        className: "bg-green-500 text-white",
      });
      navigate("/instructordashboard");
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to update course",
        className: "bg-red-500 text-white",
      });
      console.log("Error while updating course:", error);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="px-4 py-8">Loading...</div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="px-4 py-8 text-red-600">Error: {error}</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
    <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100vh-4rem)] w-full max-w-full overflow-x-hidden">
      {/* Sticky below navbar — NOT inside the scrolling main column, or tabs scroll away */}
      <div className="lg:hidden sticky top-14 sm:top-16 z-30 bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="px-2 sm:px-3 py-2 space-y-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-800"
            onClick={() => setMobileCourseNavOpen(true)}
            aria-expanded={mobileCourseNavOpen}
            aria-label="Open course content menu"
          >
            <Menu className="h-5 w-5 shrink-0" />
            Course content
          </button>
          {["form", "announcements", "discussion"].includes(view) && (
            <div
              role="tablist"
              aria-label="Course section"
              className="grid grid-cols-3 gap-1.5 w-full min-w-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === "form"}
                title="Edit course"
                className={`rounded-lg px-1 py-2.5 text-center text-[11px] sm:text-sm font-semibold leading-snug border transition-colors min-w-0 ${
                  view === "form"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                }`}
                onClick={() => {
                  setSelectedCard(null);
                  setView("form");
                }}
              >
                <span className="sm:hidden">Edit</span>
                <span className="hidden sm:inline">Edit course</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "announcements"}
                title="Announcements"
                className={`rounded-lg px-1 py-2.5 text-center text-[11px] sm:text-sm font-semibold leading-snug border transition-colors min-w-0 ${
                  view === "announcements"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                }`}
                onClick={() => setView("announcements")}
              >
                <span className="sm:hidden">Announce</span>
                <span className="hidden sm:inline">Announcements</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === "discussion"}
                title="Discussion"
                className={`rounded-lg px-1 py-2.5 text-center text-[11px] sm:text-sm font-semibold leading-snug border transition-colors min-w-0 ${
                  view === "discussion"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                }`}
                onClick={() => setView("discussion")}
              >
                <span className="sm:hidden">Discuss</span>
                <span className="hidden sm:inline">Discussion</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileCourseNavOpen && (
        <button
          type="button"
          className="fixed left-0 right-0 bottom-0 top-14 sm:top-16 z-40 bg-black/40 lg:hidden"
          aria-label="Close course menu"
          onClick={closeMobileCourseNav}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50 lg:z-auto
          left-0 top-14 sm:top-16 bottom-0 lg:top-auto lg:bottom-auto
          w-[min(90vw,20rem)] lg:w-auto
          transform transition-transform duration-200 ease-out
          ${mobileCourseNavOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] lg:max-h-none overflow-hidden
          bg-enterprise-navy p-2 lg:rounded-r-2xl
        `}
      >
        <div className="flex shrink-0 justify-end border-b border-white/10 bg-enterprise-navy p-2 lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
            onClick={closeMobileCourseNav}
            aria-label="Close course menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <CourseSidebar
            course={course}
            setCourse={setCourse}
            onCardClick={handleCardClick}
            onDiscussionClick={handleDiscussionClick}
            onAnnouncementsClick={() => {
              closeMobileCourseNav();
              setView("announcements");
            }}
            userRole="instructor"
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden no-scrollbar px-2 sm:px-4 lg:pr-2 pb-6">
        {view === "form" ? (
          <>
            <CourseForm
              course={course}
              dragActive={dragActive}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleDescriptionChange={handleDescriptionChange}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleFileInput={handleFileInput}
              removeThumbnail={removeThumbnail}
              handleSaveChanges={handleSaveChanges}
              isUploading={isUploading}
            />
          </>
        ) : view === "discussion" ? (
          <DiscussionBox
            selectedCard={selectedCard}
            onBack={handleBackToForm}
            courseId={id}
          />
        ) : view === "announcements" ? (
          <Announcements courseId={id} />
        ) : (
          <DetailedCardView
            selectedCard={selectedCard}
            onBack={handleBackToForm}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
          />
        )}
      </div>
      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedCard={selectedCard}
        onSave={handleSaveEditedCard}
      />
    </div>
    </DefaultLayout>
  );
};

export default ManageCourse;
