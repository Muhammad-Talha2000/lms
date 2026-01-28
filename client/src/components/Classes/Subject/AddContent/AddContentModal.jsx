import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AssignmentForm from "./AssignmentForm";
import QuizForm from "./QuizForm";
import { createAssignment } from "@/services/subjectServices/assignmentService";
import { createQuiz } from "@/services/subjectServices/quizServices";
import { useSelector } from "react-redux";
import ContentForm from "./ContentForm";
import LessonForm from "./LessonForm";
import { addLesson } from "@/services/subjectServices/lessonService";
import { addContent } from "@/services/subjectServices/contentService";
import { useToast } from "@/hooks/use-toast";

const AddContentModal = ({
  content,
  onClose,
  subjectId,
  refetchSubjectDetails,
}) => {
  const { type } = content;
  const [formData, setFormData] = useState({});
  const { token } = useSelector((state) => state.auth.loggedinUser);
  const { toast } = useToast();

  // Function to validate form data
  const validateFormData = () => {
    if (type === "Assignments") {
      if (!formData.title || !formData.description || !formData.dueDate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for the assignment.",
          variant: "destructive",
        });
        return false;
      }
    } else if (type === "Quizzes") {
      if (
        !formData.title ||
        !formData.questions ||
        formData.questions.length === 0
      ) {
        toast({
          title: "Error",
          description: "Quiz title and at least one question is required.",
          variant: "destructive",
        });
        return false;
      }
      for (const question of formData.questions) {
        if (
          !question.question ||
          question.options.some((opt) => !opt) ||
          question.correctAnswer === undefined
        ) {
          toast({
            title: "Error",
            description:
              "Each question must have text, four options, and a correct answer.",
            variant: "destructive",
          });
          return false;
        }
      }
    } else if (type === "Lessons") {
      if (!formData.title || !formData.content) {
        toast({
          title: "Error",
          description: "Lesson title and url are required.",
          variant: "destructive",
        });
        return false;
      }
    } else if (type === "Content") {
      if (!formData.name || !formData.url) {
        toast({
          title: "Error",
          description: "Content title and file is required.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateFormData()) return; // Stop if validation fails

    try {
      let response;
      if (type === "Assignments") {
        response = await createAssignment(subjectId, formData, token);
      } else if (type === "Quizzes") {
        response = await createQuiz(subjectId, formData, token);
      } else if (type === "Lessons") {
        response = await addLesson(subjectId, formData, token);
      } else if (type === "Content") {
        response = await addContent(subjectId, formData, token);
      }

      console.log(`${type} added successfully!`);
      toast({
        title: "Success",
        description: `Successfully created ${type}.`,
        variant: "success",
      });
      refetchSubjectDetails(); // ✅ Trigger re-fetch of subject details
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || `Failed to create ${type}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {type}</DialogTitle>
        </DialogHeader>

        {/* Render Forms Based on Type */}
        {type === "Assignments" && <AssignmentForm setFormData={setFormData} />}
        {type === "Quizzes" && <QuizForm setFormData={setFormData} />}
        {type === "Lessons" && <LessonForm setFormData={setFormData} />}
        {type === "Content" && <ContentForm setFormData={setFormData} />}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentModal;
