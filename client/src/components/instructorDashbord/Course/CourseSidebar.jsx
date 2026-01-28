import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ContentLibraryForm,
  LessonForm,
  AssignmentForm,
  QuizForm,
} from "./ContentModal";
import { useSelector } from "react-redux";
import { updateCourse } from "@/services/courseService";
import { GoDiscussionDuplicate } from "react-icons/go";
import {
  getQuizAttempt,
  getAssignmentSubmission,
} from "@/services/courseService";
import { PiMicroscopeFill } from "react-icons/pi";

const CourseSidebar = ({
  course = {},
  setCourse,
  onCardClick,
  onDiscussionClick,
  onAnnouncementsClick,
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [quizStatuses, setQuizStatuses] = useState({});
  const [assignmentStatuses, setAssignmentStatuses] = useState({});

  const { toast } = useToast();
  const { loggedinUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!course.quizzes && !course.assignments) return;

      const newQuizStatuses = {};
      const newAssignmentStatuses = {};
      for (const quiz of course.quizzes || []) {
        try {
          const data = await getQuizAttempt(
            course._id,
            quiz._id,
            loggedinUser.token
          );
          newQuizStatuses[quiz._id] = data.attempt ? "Submitted" : "On Due";
        } catch (error) {
          newQuizStatuses[quiz._id] = "On Due"; // Default if there's an error
        }
      }
      for (const assignment of course.assignments || []) {
        try {
          const response = await getAssignmentSubmission(
            course._id,
            assignment._id,
            loggedinUser.token
          );
          newAssignmentStatuses[assignment._id] = response
            ? "Submitted"
            : "Pending";
        } catch (error) {
          newAssignmentStatuses[assignment._id] = "Pending";
        }
      }

      // Update states after all requests finish
      setQuizStatuses(newQuizStatuses);
      setAssignmentStatuses(newAssignmentStatuses);
    };

    fetchStatuses();
  }, [course.quizzes, course.assignments, course._id]); // Dependencies

  const handleSaveContent = async (data) => {
    try {
      // Update course state first
      setCourse((prev) => {
        const updatedCourse = {
          ...prev,
          contentLibrary: [...(prev.contentLibrary || []), data],
        };
        return updatedCourse;
      });

      // Wait until state is updated, then call API
      await updateCourse(
        {
          ...course,
          contentLibrary: [...(course.contentLibrary || []), data],
        },
        course._id,
        loggedinUser.token
      );

      toast({
        title: "Success!",
        description: "Content added and course updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to Add content course",
        className: "bg-red-500 text-white",
      });
      console.error("Error while updating course:", error);
    }
  };

  const handleSaveLesson = async (data) => {
    try {
      // Update course state first
      setCourse((prev) => {
        const updatedCourse = {
          ...prev,
          lessons: [...(prev.lessons || []), data],
        };
        return updatedCourse;
      });

      // Wait until state is updated, then call API
      await updateCourse(
        { ...course, lessons: [...(course.lessons || []), data] },
        course._id,
        loggedinUser.token
      );

      toast({
        title: "Success!",
        description: "Lesson added and course updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to Add content course",
        className: "bg-red-500 text-white",
      });
      console.error("Error while updating course:", error);
    }
  };

  const handleSaveAssignment = async (data) => {
    try {
      // Update course state first
      setCourse((prev) => {
        const updatedCourse = {
          ...prev,
          assignments: [...(prev.assignments || []), data],
        };
        return updatedCourse;
      });

      // Wait until state is updated, then call API
      await updateCourse(
        { ...course, assignments: [...(course.assignments || []), data] },
        course._id,
        loggedinUser.token
      );

      toast({
        title: "Success!",
        description: "Assignment added and course updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to Add Asssignment course",
        className: "bg-red-500 text-white",
      });
      console.error("Error while updating course:", error);
    }
  };

  const handleSaveQuiz = async (data) => {
    try {
      // Update course state first
      setCourse((prev) => {
        const updatedCourse = {
          ...prev,
          quizzes: [...(prev.quizzes || []), data],
        };
        return updatedCourse;
      });

      // Wait until state is updated, then call API
      await updateCourse(
        { ...course, quizzes: [...(course.quizzes || []), data] },
        course._id,
        loggedinUser.token
      );

      toast({
        title: "Success!",
        description: "Quiz added and course updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "Failed to Add Quiz course",
        className: "bg-red-500 text-white",
      });
      console.error("Error while updating course:", error);
    }
  };

  const renderContentLibrary = () => (
    <div className="space-y-4">
      {(course.contentLibrary || []).map((content, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer"
          onClick={() => onCardClick("content", content)}
        >
          <div className="font-medium">{content.name}</div>
        </Card>
      ))}
      {loggedinUser.user.role === "instructor" && (
        <Button
          className="w-full bg-orange-50 text-orange-500 hover:bg-orange-100 border-2 border-dashed border-orange-200"
          onClick={() => setActiveModal("content")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      )}
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-4">
      {(course.lessons || []).map((lesson, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer"
          onClick={() => onCardClick("lesson", lesson)}
        >
          <div className="font-medium">{lesson.title}</div>
        </Card>
      ))}
      {loggedinUser.user.role === "instructor" && (
        <Button
          className="w-full bg-orange-50 text-orange-500 hover:bg-orange-100 border-2 border-dashed border-orange-200"
          onClick={() => setActiveModal("lesson")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-4">
      {(course.assignments || []).map((assignment, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer"
          onClick={() => onCardClick("assignment", assignment)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{assignment.title}</div>
              <div className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
              </div>
            </div>
            {loggedinUser.user.role === "student" && (
              <span
                className={`text-[0.69rem] font-medium px-2 py-1 rounded-full ${
                  assignmentStatuses[assignment._id] === "Submitted"
                    ? "bg-green-50 text-green-700 border border-green-300"
                    : "bg-red-50 text-red-700 border border-red-300"
                }`}
              >
                {assignmentStatuses[assignment._id] || "Pending"}
              </span>
            )}
          </div>
        </Card>
      ))}
      {loggedinUser.user.role === "instructor" && (
        <Button
          className="w-full bg-orange-50 text-orange-500 hover:bg-orange-100 border-2 border-dashed border-orange-200"
          onClick={() => setActiveModal("assignment")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      )}
    </div>
  );

  const renderQuizzes = () => (
    <div className="space-y-4">
      {(course.quizzes || []).map((quiz, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer "
          onClick={() => onCardClick("quiz", quiz)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{quiz.title}</div>
            {loggedinUser.user.role === "student" && (
              <span
                className={`text-[0.69rem] font-medium px-2 py-1 rounded-full ${
                  quizStatuses[quiz._id] === "Submitted"
                    ? " bg-green-50 text-green-700 border border-green-300"
                    : "bg-orange-50 text-orange-700 border border-orange-300"
                }`}
              >
                {quizStatuses[quiz._id] || "On Due"}
              </span>
            )}
          </div>
        </Card>
      ))}
      {loggedinUser.user.role === "instructor" && (
        <Button
          className="w-full bg-orange-50 text-orange-500 hover:bg-orange-100 border-2 border-dashed border-orange-200"
          onClick={() => setActiveModal("quiz")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-gray-100 shadow-lg relative  flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex-1 ">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">
            {course?.name || "Untitled Course"}
          </h2>
          {course?.thumbnail && (
            <img
              src={course.thumbnail}
              alt="Course thumbnail"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}
        </div>
        <nav className="px-4  pb-20">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content">
              <AccordionTrigger>
                Content Library ({(course.contentLibrary || []).length})
              </AccordionTrigger>
              <AccordionContent>{renderContentLibrary()}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="lessons">
              <AccordionTrigger>
                Lessons ({(course.lessons || []).length})
              </AccordionTrigger>
              <AccordionContent>{renderLessons()}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="assignments">
              <AccordionTrigger>
                Assignments ({(course.assignments || []).length})
              </AccordionTrigger>
              <AccordionContent>{renderAssignments()}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="quizzes">
              <AccordionTrigger>
                Quizzes ({(course.quizzes || []).length})
              </AccordionTrigger>
              <AccordionContent>{renderQuizzes()}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            className="w-full text-orange-500 bg-transparent border border-orange-500"
            onClick={onAnnouncementsClick}
          >
            <PiMicroscopeFill className="w-8 h-8 " />
            Announcements
          </Button>
        </nav>

        <div className=" px-4 fixed bottom-0 left-0 w-80  bg-transparent h-20 flex items-center justify-center ">
          <Button
            className="bg-orange-500 w-full   text-white hover:bg-orange-600"
            onClick={onDiscussionClick} // This will trigger the view change in LearningPage
          >
            <GoDiscussionDuplicate className="w-8 h-8 " />
            Discussion Box
          </Button>
        </div>
      </div>

      {loggedinUser.user.role === "instructor" && (
        <>
          <ContentLibraryForm
            isOpen={activeModal === "content"}
            onClose={() => setActiveModal(null)}
            onSave={handleSaveContent}
          />
          <LessonForm
            isOpen={activeModal === "lesson"}
            onClose={() => setActiveModal(null)}
            onSave={handleSaveLesson}
          />
          <AssignmentForm
            isOpen={activeModal === "assignment"}
            onClose={() => setActiveModal(null)}
            onSave={handleSaveAssignment}
          />
          <QuizForm
            isOpen={activeModal === "quiz"}
            onClose={() => setActiveModal(null)}
            onSave={handleSaveQuiz}
          />
        </>
      )}
    </div>
  );
};

export default CourseSidebar;
