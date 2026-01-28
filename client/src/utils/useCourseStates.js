import { useState, useEffect } from "react";
import { getCourseById, updateCourse } from "@/services/courseService";

const useCourseStates = (courseId, loggedinUser) => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [view, setView] = useState("form");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch course on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        setError("Failed to fetch course details");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  // Save course changes to the backend
  const saveCourseChanges = async () => {
    try {
      const updatedData = await updateCourse(
        course,
        courseId,
        loggedinUser.token
      );
      return updatedData;
    } catch (error) {
      setError("Failed to update course");
      throw error;
    }
  };

  return {
    course,
    setCourse,
    loading,
    error,
    isUploading,
    setIsUploading,
    dragActive,
    setDragActive,
    selectedCard,
    setSelectedCard,
    view,
    setView,
    isEditModalOpen,
    setIsEditModalOpen,
    saveCourseChanges,
  };
};

export default useCourseStates;
