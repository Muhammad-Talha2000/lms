import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "@/services/courseService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
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
    setView("discussion"); // Changes the view to "discussion"
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      {/* <CourseSidebar course={course} setCourse={setCourse} /> */}
      <CourseSidebar
        course={course}
        setCourse={setCourse}
        onCardClick={handleCardClick}
        onDiscussionClick={handleDiscussionClick}
        onAnnouncementsClick={() => setView("announcements")}
        userRole="instructor"
      />
      <div className="flex-1 flex flex-col  h-full overflow-y-auto no-scrollbar pr-2">
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
  );
};

export default ManageCourse;
