import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  QuizView,
  LessonView,
  ContentView,
  AssignmentView,
} from "@/components/instructorDashbord/Course/DetailedCardView";
import { useSelector } from "react-redux";
import AssignmentSubmissionView from "./AssignmentSubmissionView";
import QuizAttemptView from "./QuizAttemptView";
import { ArrowLeftIcon, Edit } from "lucide-react";
import { CheckSquare, Video, FileText, BookOpen } from "lucide-react";
import EditContentModal from "./EditContent/EditContentModal";
import DeleteCard from "./EditContent/DeleteCard";
import { useToast } from "@/hooks/use-toast";
import { deleteLesson } from "@/services/subjectServices/lessonService";
import { deleteQuiz } from "@/services/subjectServices/quizServices";
import { deleteAssignment } from "@/services/subjectServices/assignmentService";
import { deleteContent } from "@/services/subjectServices/contentService";

const CardView = ({ data, setView, subjectId, refetchSubjectDetails }) => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const role = loggedinUser?.user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      if (data.type === "Lessons") {
        await deleteLesson(subjectId, data._id, loggedinUser.token);
      } else if (data.type === "Quizzes") {
        await deleteQuiz(subjectId, data._id, loggedinUser.token);
      } else if (data.type === "Assignments") {
        await deleteAssignment(subjectId, data._id, loggedinUser.token);
      } else if (data.type === "Content") {
        await deleteContent(subjectId, data._id, loggedinUser.token);
      }

      toast({
        title: "Deleted Successfully",
        description: `${data.type} has been removed.`,
      });

      refetchSubjectDetails();
      setView("details");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Deletion Failed",
        description: "Something went wrong while deleting.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-w-0 max-w-full">
      <Button
        onClick={() => setView("details")}
        className="mb-4 w-full border border-orange-500 bg-orange-50 text-orange-500 hover:bg-orange-100 sm:my-6 sm:mb-6 sm:w-auto"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Back to overview
      </Button>
      <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 text-lg font-bold text-orange-500">
          {data.type === "Content" && (
            <BookOpen className="mt-0.5 h-6 w-6 shrink-0" />
          )}
          {data.type === "Lessons" && (
            <Video className="mt-0.5 h-6 w-6 shrink-0" />
          )}
          {data.type === "Assignments" && (
            <FileText className="mt-0.5 h-6 w-6 shrink-0" />
          )}
          {data.type === "Quizzes" && (
            <CheckSquare className="mt-0.5 h-6 w-6 shrink-0" />
          )}
          <span className="min-w-0 break-words leading-snug">
            {data.title || data.name}
          </span>
        </div>

        {role === "instructor" && (
          <div className="flex shrink-0 items-center gap-4 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
              aria-label="Edit"
            >
              <Edit className="h-5 w-5" />
            </button>
            <DeleteCard
              onConfirm={handleDelete}
              isDeleting={isDeleting}
              title={data.type}
            />
          </div>
        )}
      </div>

      {data.type === "Content" && (
        <ContentView name={data.name} type={data.type} url={data.url} />
      )}
      {data.type === "Lessons" && (
        <LessonView title={data.title} content={data.content} />
      )}
      {data.type === "Assignments" &&
        (role !== "student" ? (
          <AssignmentView
            title={data.title}
            description={data.description}
            dueDate={data.dueDate}
          />
        ) : (
          <AssignmentSubmissionView assignment={data} />
        ))}
      {data.type === "Quizzes" &&
        (role !== "student" ? (
          <QuizView questions={data.questions} />
        ) : (
          <QuizAttemptView quiz={data} />
        ))}

      {isModalOpen && (
        <EditContentModal
          content={data}
          onClose={() => setIsModalOpen(false)}
          subjectId={subjectId}
          refetchSubjectDetails={refetchSubjectDetails}
        />
      )}
    </div>
  );
};

export default CardView;
