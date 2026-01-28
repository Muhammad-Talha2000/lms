import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getStudentQuizAttempt,
  submitQuiz,
} from "@/services/subjectServices/quizServices";

const QuizAttemptView = ({ quiz }) => {
  console.log("Checking if quiz id is changing", quiz._id);
  const [answers, setAnswers] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { subjectId } = useParams();
  const { toast } = useToast();
  const userToken = useSelector((state) => state.auth.loggedinUser.token);

  useEffect(() => {
    const fetchStudentAttempt = async () => {
      setLoading(true);
      try {
        const response = await getStudentQuizAttempt(
          subjectId,
          quiz._id,
          userToken
        );
        const attemptData = response?.attempt;

        if (attemptData && attemptData.answers) {
          setSubmittedData(attemptData);
          setAnswers(
            attemptData.answers.reduce((acc, answer, index) => {
              acc[quiz.questions[index]._id] = answer;
              return acc;
            }, {})
          );
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load previous quiz attempt.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (quiz?._id) fetchStudentAttempt();
  }, [subjectId, quiz._id, userToken, toast]);

  const handleAnswerChange = (questionId, answer) => {
    if (submittedData) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    return quiz.questions.reduce((score, q) => {
      return score + (answers[q._id] === q.options[q.correctAnswer] ? 1 : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { answers, score: calculateScore() };
      const response = await submitQuiz(
        subjectId,
        quiz._id,
        payload,
        userToken
      );

      setSubmittedData(response);
      toast({
        title: "Quiz Submitted",
        description: `You scored ${response.score} out of ${quiz.questions.length}.`,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong while submitting.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center h-40">
          <p>Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  const hasAttempted = !!submittedData;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{quiz.title}</h2>
          {hasAttempted && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              Attempted
            </span>
          )}
        </div>

        {hasAttempted && (
          <p className="text-lg font-bold text-blue-600">
            Your Score: {submittedData.score} / {quiz.questions.length}
          </p>
        )}

        {quiz.questions.map((q, index) => (
          <div key={q._id} className="space-y-2 p-4 border rounded-lg">
            <p className="font-semibold">
              {index + 1}. {q.question}
            </p>
            <div className="flex flex-col gap-2 mt-2">
              {q.options.map((option, optIndex) => {
                const isCorrect = optIndex === q.correctAnswer;
                const isSelected = answers[q._id] === option;
                const showResults = hasAttempted;

                return (
                  <label
                    key={optIndex}
                    className={`flex items-center gap-2 p-2 rounded ${
                      showResults
                        ? isCorrect
                          ? "bg-green-100"
                          : isSelected
                          ? "bg-red-100"
                          : ""
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(q._id, option)}
                      disabled={hasAttempted}
                      className="cursor-pointer"
                    />
                    {option}
                    {showResults && isCorrect && (
                      <span className="text-green-600 font-bold">
                        (Correct)
                      </span>
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <span className="text-red-600 font-bold">
                        (Your Answer)
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!hasAttempted && (
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full md:w-auto"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizAttemptView;
