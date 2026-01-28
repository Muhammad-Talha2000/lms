import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "@/services/courseService";
import CourseSidebar from "@/components/instructorDashbord/Course/CourseSidebar";
import EnrolledCourse from "@/components/coure details/EnrolledCourse";
import CourseFormData from "@/components/instructorDashbord/Course/CourseFormData";
import DiscussionBox from "@/components/coure details/Discussion box/DiscussionBox";

const CourseDetailsChck = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [view, setView] = useState("form");
  const [dragActive, setDragActive] = useState(false);
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
  const handleCardClick = (type, card) => {
    setSelectedCard({ type, card });
    setView("detail");
  };
  const handleBackToForm = () => {
    setSelectedCard(null);
    setView("form");
  };
  const handleDiscussionClick = () => {
    setView("discussion"); // Changes the view to "discussion"
  };
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      <CourseSidebar
        course={course}
        onCardClick={handleCardClick}
        userRole="admin"
        onDiscussionClick={handleDiscussionClick}
      />
      <div className="flex-1 flex flex-col  h-full overflow-y-auto no-scrollbar pr-2">
        {view === "form" ? (
          <CourseFormData course={course} />
        ) : view === "discussion" ? (
          <DiscussionBox
            selectedCard={selectedCard}
            onBack={handleBackToForm}
          />
        ) : (
          <EnrolledCourse
            selectedCard={selectedCard}
            onBack={handleBackToForm}
            courseId={id}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetailsChck;
