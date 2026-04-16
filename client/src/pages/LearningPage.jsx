import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getCourseById } from "@/services/courseService";
import CourseSidebar from "@/components/instructorDashbord/Course/CourseSidebar";
import EnrolledCourse from "@/components/coure details/EnrolledCourse";
import CourseFormData from "@/components/instructorDashbord/Course/CourseFormData";
import DiscussionBox from "@/components/coure details/Discussion box/DiscussionBox";
import Announcements from "@/components/instructorDashbord/Course/Announcements";
import DefaultLayout from "@/components/layout/DefaultLayout";

const LearningPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [view, setView] = useState("form");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    return (
      <DefaultLayout>
        <div className="px-4 py-10 text-center text-gray-600">Loading...</div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="px-4 py-10 text-center text-red-600">Error: {error}</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 lg:px-6">
        <div className="sticky top-14 z-20 mb-3 flex border-b border-gray-200 bg-white/95 px-2 py-2 shadow-sm backdrop-blur sm:top-16 lg:hidden">
          <button
            type="button"
            className="inline-flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800"
            onClick={() => setMobileSidebarOpen(true)}
            aria-expanded={mobileSidebarOpen}
            aria-label="Open course menu"
          >
            <Menu className="h-5 w-5" />
            Course menu
          </button>
        </div>

        {mobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close course menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="flex min-h-[calc(100vh-10rem)] flex-col gap-4 lg:flex-row">
          <aside
            className={`fixed left-0 top-14 bottom-0 z-40 w-[min(88vw,22rem)] bg-white p-2 shadow-xl transition-transform duration-200 sm:top-16 lg:static lg:w-80 lg:translate-x-0 lg:shadow-none ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="mb-2 flex justify-end lg:hidden">
              <button
                type="button"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close course menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-[calc(100%-2.5rem)] lg:h-full overflow-y-auto">
              <CourseSidebar
                course={course}
                onCardClick={handleCardClick}
                userRole="learner"
                onDiscussionClick={handleDiscussionClick}
                onAnnouncementsClick={() => setView("announcements")}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden rounded-2xl border border-gray-100 bg-white p-3 sm:p-4">
            {view === "form" ? (
              <CourseFormData course={course} />
            ) : view === "discussion" ? (
              <DiscussionBox
                selectedCard={selectedCard}
                onBack={handleBackToForm}
                courseId={id}
              />
            ) : view === "announcements" ? (
              <Announcements courseId={id} />
            ) : (
              <EnrolledCourse
                selectedCard={selectedCard}
                onBack={handleBackToForm}
                courseId={id}
              />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LearningPage;
