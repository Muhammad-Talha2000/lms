import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContentModal from "./ContentModal";
import { uploadFileToCloudinary } from "@/services/cloudinaryService";

const EditCardModal = ({ isOpen, onClose, selectedCard, onSave }) => {
  const [formData, setFormData] = useState({});

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please upload only PDF files");
      e.target.value = null;
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && selectedCard) {
      setFormData(selectedCard.card);
    }
  }, [isOpen, selectedCard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSave(selectedCard.type, formData);
  //   onClose();
  // };

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

      onSave(selectedCard.type, {
        ...formData,
        url: uploadedUrl,
      });

      onClose();
    } catch (error) {
      setError(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  if (!selectedCard) return null;

  const renderEditForm = () => {
    switch (selectedCard.type) {
      case "content":
        // return (
        //   <>
        //     <div>
        //       <Label>Name</Label>
        //       <Input
        //         name="name"
        //         value={formData.name || ""}
        //         onChange={handleInputChange}
        //         required
        //       />
        //     </div>
        //     <div>
        //       <Label>URL</Label>
        //       <Input
        //         name="url"
        //         value={formData.url || ""}
        //         onChange={handleInputChange}
        //         required
        //       />
        //     </div>
        //     <div>
        //       <Label>Type</Label>
        //       <Select
        //         value={formData.type || "document"}
        //         onValueChange={(value) => handleSelectChange("type", value)}
        //       >
        //         <SelectTrigger>
        //           <SelectValue placeholder="Select type" />
        //         </SelectTrigger>
        //         <SelectContent>
        //           <SelectItem value="document">Document</SelectItem>
        //           <SelectItem value="Pdf">PDF</SelectItem>
        //           <SelectItem value="image">Image</SelectItem>
        //         </SelectContent>
        //       </Select>
        //     </div>
        //   </>
        // );

        return (
          <>
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>PDF File</Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            {/* <div>
              <Label>Type</Label>
              <Select
                value={formData.type || "document"}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </>
        );
      case "lesson":
        return (
          <>
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                name="content"
                value={formData.content || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );

      case "assignment":
        return (
          <>
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );

      case "quiz":
        return (
          <div className="space-y-6 h-[70vh] overflow-y-scroll no-scrollbar">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {(formData.questions || []).map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="space-y-4 border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <Label>Question {questionIndex + 1}</Label>
                  {(formData.questions || []).length > 1 && (
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
                    onChange={(e) =>
                      updateQuestion(questionIndex, e.target.value)
                    }
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
                          updateOption(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
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
          </div>
        );

      default:
        return <p>No edit form available for this type</p>;
    }
  };

  return (
    <ContentModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${selectedCard.type}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderEditForm()}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Save Changes
          </Button>
        </div>
      </form>
    </ContentModal>
  );
};

export default EditCardModal;
