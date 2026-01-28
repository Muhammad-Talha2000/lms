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
  console.log(data);
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
    <div>
      <Button
        onClick={() => setView("details")}
        className="my-8 bg-orange-50 hover:bg-orange-100 text-orange-500 border border-orange-500"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </Button>
      <div className="mb-4 font-bold text-lg flex items-center justify-between">
        <div className="text-orange-500">
          {data.type === "Content" && <BookOpen className="h-6 w-6 inline" />}
          {data.type === "Lessons" && <Video className="h-6 w-6 inline" />}
          {data.type === "Assignments" && (
            <FileText className="h-6 w-6 inline" />
          )}
          {data.type === "Quizzes" && (
            <CheckSquare className="h-6 w-6 inline" />
          )}
          <span className="ml-2">{data.title || data.name}</span>
        </div>

        {role === "instructor" && (
          <div className="flex gap-4 items-center">
            <Edit
              onClick={() => setIsModalOpen(true)}
              className="w-5 h-5 cursor-pointer text-blue-500"
            />
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
