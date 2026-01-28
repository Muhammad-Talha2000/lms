import { Trash2 } from "lucide-react";
import React, { useState } from "react";

const QuizForm = ({ formData, setFormData }) => {
  const [quizData, setQuizData] = useState(() => ({
    title: formData?.title || "",
    questions: formData?.questions?.length
      ? formData.questions
      : [
          {
            question: "",
            options: ["", "", "", ""], // Four default options
            correctAnswer: 0,
          },
        ],
  }));

  // Update form data in AddContentModal
  React.useEffect(() => {
    setFormData(quizData);
  }, [quizData, setFormData]);

  // Handle title change
  const handleTitleChange = (e) => {
    setQuizData((prev) => ({ ...prev, title: e.target.value }));
  };

  // Add new question
  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    }));
  };

  // Remove question
  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      setQuizData((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    }
  };

  // Update question text
  const updateQuestionText = (index, value) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, question: value } : q
      ),
    }));
  };

  // Update options
  const updateOption = (qIndex, optIndex, value) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  // Update correct answer
  const updateCorrectAnswer = (qIndex, optIndex) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, correctAnswer: optIndex } : q
      ),
    }));
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-scroll no-scrollbar">
      <input
        type="text"
        placeholder="Quiz Title"
        className="w-full border rounded p-2"
        value={quizData.title}
        onChange={handleTitleChange}
      />

      {quizData.questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-3 rounded space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Question {qIndex + 1}</p>
            {quizData.questions.length > 1 && (
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => removeQuestion(qIndex)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Enter question"
            className="w-full border rounded p-2"
            value={q.question}
            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
          />

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Options:</p>
            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  className="flex-1 border rounded p-2"
                  value={option}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, e.target.value)
                  }
                />
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === optIndex}
                  onChange={() => updateCorrectAnswer(qIndex, optIndex)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="p-2 w-full bg-gray-200 rounded"
        onClick={addQuestion}
      >
        + Add Question
      </button>
    </div>
  );
};

export default QuizForm;
