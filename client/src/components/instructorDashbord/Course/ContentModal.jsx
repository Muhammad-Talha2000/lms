import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { uploadFileToCloudinary } from "@/services/cloudinaryService";

// Base Modal Form Component
const ContentModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const ContentLibraryForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "pdf",
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (selectedFile) {
      // Check if the file is a PDF
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload only PDF files");
        e.target.value = null; // Reset file input
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedUrl = await uploadFileToCloudinary(file);

      // Save with the uploaded URL
      onSave({
        ...formData,
        url: uploadedUrl,
      });

      // Reset form
      setFormData({ name: "", type: "pdf" });
      setFile(null);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ContentModal isOpen={isOpen} onClose={onClose} title="Add PDF Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="file">PDF File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            type="submit"
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </ContentModal>
  );
};

// Lesson Form
export const LessonForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    content: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    //reset form
    setFormData({
      title: "",
      content: "",
    });
  };

  return (
    <ContentModal isOpen={isOpen} onClose={onClose} title="Add Lesson">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Lesson Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Video URL</Label>
          <Input
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Save
          </Button>
        </DialogFooter>
      </form>
    </ContentModal>
  );
};

// Assignment Form
export const AssignmentForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // reset form
    setFormData({
      title: "",
      description: "",
      dueDate: "",
    });
  };

  return (
    <ContentModal isOpen={isOpen} onClose={onClose} title="Add Assignment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Assignment Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Save
          </Button>
        </DialogFooter>
      </form>
    </ContentModal>
  );
};

// Quiz Form
export const QuizForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""], // Initialize with 4 empty options
        correctAnswer: 0,
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      title: "",
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex),
      }));
    }
  };

  const updateQuestion = (questionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, question: value } : q
      ),
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, oIndex) =>
                oIndex === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const updateCorrectAnswer = (questionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, correctAnswer: parseInt(value) } : q
      ),
    }));
  };

  return (
    <ContentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Quiz"
      className="h-[80vh] overflow-y-scroll"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6 h-[80vh] overflow-y-scroll no-scrollbar"
      >
        <div>
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {formData.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="space-y-4 border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <Label>Question {questionIndex + 1}</Label>
              {formData.questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(questionIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Input
                value={question.question}
                onChange={(e) => updateQuestion(questionIndex, e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) =>
                      updateOption(questionIndex, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                  <Input
                    type="radio"
                    name={`correct-${questionIndex}`}
                    checked={question.correctAnswer === optionIndex}
                    onChange={() =>
                      updateCorrectAnswer(questionIndex, optionIndex)
                    }
                    className="w-4"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          Add Question
        </Button>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Save Quiz
          </Button>
        </DialogFooter>
      </form>
    </ContentModal>
  );
};

export default ContentModal;
