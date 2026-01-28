import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitQuizAttempt, getQuizAttempt } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

const QuizView = ({ card, courseId, onQuizSubmit }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(card.questions.length).fill(null)
  );
  const [error, setError] = useState("");
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { loggedinUser } = useSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    setIsSubmitted(false);
    setSelectedAnswers(Array(card.questions.length).fill(null));
    setScore(null);
    setError("");
    setIsSubmitting(false);
    setIsLoading(true);
    const checkPreviousAttempt = async () => {
      try {
        const data = await getQuizAttempt(
          courseId,
          card._id,
          loggedinUser.token
        );

        if (data.attempt) {
          setSelectedAnswers(data.attempt.answers);
          setScore(data.attempt.score);
          setIsSubmitted(true);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkPreviousAttempt();
  }, [courseId, card._id, loggedinUser.token, toast]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.includes(null)) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      // Calculate Score
      let correctCount = 0;
      card.questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.correctAnswer) {
          correctCount++;
        }
      });
      const finalScore = correctCount;
      setScore(finalScore);

      // Submit to backend
      console.log(selectedAnswers);
      console.log(finalScore);
      const data = await submitQuizAttempt(
        courseId,
        card._id,
        loggedinUser.token,
        selectedAnswers,
        finalScore
      );
      console.log(data);

      toast({
        title: "Success!",
        description: `Quiz submitted successfully. Your score is ${finalScore} / ${card.questions.length}
        `,
        className: "bg-green-500 text-white",
      });
      setIsSubmitted(true);
      if (onQuizSubmit) {
        onQuizSubmit();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{card.title}</h1>
        <span
          className={`ml-4 text-sm font-medium px-3 py-1 rounded-lg ${
            isSubmitted
              ? "bg-green-50 text-green-700 border border-green-300"
              : "bg-orange-50 text-orange-700 border border-orange-300"
          }`}
        >
          {isSubmitted ? "Submitted" : "On Due"}
        </span>
      </div>
      {/* {error && <p className="text-red-600 font-medium">{error}</p>} */}

      {card.questions.map((q, index) => (
        <Card key={index} className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">
                Q{index + 1}
              </Badge>
              <div className="flex-1">
                <p className="font-medium text-lg mb-4">{q.question}</p>
                <div className="space-y-3">
                  {q.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(index, idx)}
                      disabled={isSubmitted}
                      className={`flex items-center w-full text-left p-4 rounded-lg transition-colors border ${
                        selectedAnswers[index] === idx
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      } ${isSubmitted && "cursor-not-allowed opacity-60"}`}
                    >
                      <span
                        className={`mr-3 w-5 h-5 flex items-center justify-center rounded-full border ${
                          selectedAnswers[index] === idx
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {selectedAnswers[index] === idx && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          selectedAnswers[index] === idx
                            ? "text-blue-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {isSubmitted && (
        <p className="text-lg font-semibold text-green-700">
          Your Score: {score} / {card.questions.length}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitted || isSubmitting}
          className={`${
            isSubmitted || isSubmitting ? "cursor-not-allowed opacity-60" : ""
          } px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg`}
        >
          {isSubmitting
            ? "Submitting..."
            : isSubmitted
            ? "Submitted"
            : "Submit"}
        </Button>
      </div>
      {isSubmitted && (
        <div className="space-y-6">
          <p className="text-lg font-semibold text-gray-700">Quiz Summary</p>
          {card.questions.map((q, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    Q{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-lg mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            q.correctAnswer === idx
                              ? "bg-green-50 border-green-200"
                              : selectedAnswers[index] === idx
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <p
                            className={`${
                              q.correctAnswer === idx
                                ? "text-green-700 font-medium"
                                : selectedAnswers[index] === idx
                                ? "text-red-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {option}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizView;



// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { submitQuizAttempt, getQuizAttempt } from "@/services/courseService";
// import { useToast } from "@/hooks/use-toast";

// const QuizView = ({ card, courseId }) => {
//   const [quizState, setQuizState] = useState({});
//   const { loggedinUser } = useSelector((state) => state.auth);
//     const [selectedAnswers, setSelectedAnswers] = useState(
//     Array(card.questions.length).fill(null)
//   );
//   const { toast } = useToast();

//   useEffect(() => {
//     const checkPreviousAttempt = async () => {
//       try {
//         const data = await getQuizAttempt(courseId, card._id, loggedinUser.token);

//         if (data.attempt) {
//           setQuizState((prevState) => ({
//             ...prevState,
//             [card._id]: {
//               selectedAnswers: data.attempt.answers,
//               score: data.attempt.score,
//               isSubmitted: true,
//             },
//           }));
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: error.message,
//           className: "bg-red-500 text-white",
//         });
//       }
//     };

//     checkPreviousAttempt();
//   }, [courseId, card._id, loggedinUser.token, toast]);

//   const handleAnswerSelect = (questionIndex, optionIndex) => {
//     setQuizState((prevState) => {
//       const updatedAnswers = [...(prevState[card._id]?.selectedAnswers || Array(card.questions.length).fill(null))];
//       updatedAnswers[questionIndex] = optionIndex;

//       return {
//         ...prevState,
//         [card._id]: {
//           ...prevState[card._id],
//           selectedAnswers: updatedAnswers,
//         },
//       };
//     });
//   };
  
 
//   const handleSubmit = async () => {
//     if (!quizState[card._id]?.selectedAnswers || quizState[card._id].selectedAnswers.includes(null)) {
//       toast({
//         title: "Incomplete",
//         description: "Please answer all questions before submitting.",
//         className: "bg-red-500 text-white",
//       });
//       return;
//     }

//     try {
//       const correctCount = card.questions.reduce(
//         (count, q, index) => count + (quizState[card._id].selectedAnswers[index] === q.correctAnswer ? 1 : 0),
//         0
//       );

//       const finalScore = correctCount;

//       await submitQuizAttempt(courseId, card._id, loggedinUser.token, quizState[card._id].selectedAnswers, finalScore);

//       toast({
//         title: "Success!",
//         description: `Quiz submitted successfully. Your score is ${finalScore} / ${card.questions.length}`,
//         className: "bg-green-500 text-white",
//       });

//       setQuizState((prevState) => ({
//         ...prevState,
//         [card._id]: {
//           ...prevState[card._id],
//           score: finalScore,
//           isSubmitted: true,
//         },
//       }));
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Error submitting quiz",
//         className: "bg-red-500 text-white",
//       });
//     }
//   };

//   const currentQuiz = quizState[card._id] || { selectedAnswers: Array(card.questions.length).fill(null), isSubmitted: false, score: null };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold text-gray-900">{card.title}</h1>
//         <span className={`ml-4 text-sm font-medium px-3 py-1 rounded-lg ${currentQuiz.isSubmitted ? "bg-green-50 text-green-700 border border-green-300" : "bg-orange-50 text-orange-700 border border-orange-300"}`}>
//           {currentQuiz.isSubmitted ? "Submitted" : "On Due"}
//         </span>
//       </div>

//       {card.questions.map((q, index) => (
//         <Card key={index} className="shadow-md">
//           <CardContent className="p-6">
//             <div className="flex items-start gap-4">
//               <Badge variant="outline" className="mt-1">Q{index + 1}</Badge>
//               <div className="flex-1">
//                 <p className="font-medium text-lg mb-4">{q.question}</p>
//                 <div className="space-y-3">
//                   {q.options.map((option, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => handleAnswerSelect(index, idx)}
//                       disabled={currentQuiz.isSubmitted}
//                       className={`flex items-center w-full text-left p-4 rounded-lg transition-colors border ${currentQuiz.selectedAnswers[index] === idx ? "bg-blue-50 border-orange-300" : "bg-gray-50 border-gray-200 hover:bg-gray-100"} ${currentQuiz.isSubmitted && "cursor-not-allowed opacity-60"}`}
//                     >
//                       <span className={`mr-3 w-5 h-5 flex items-center justify-center rounded-full border ${currentQuiz.selectedAnswers[index] === idx ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-300"}`}>
//                         {currentQuiz.selectedAnswers[index] === idx && <CheckCircle className="w-4 h-4" />}
//                       </span>
//                       <span className={`text-sm ${currentQuiz.selectedAnswers[index] === idx ? "text-gray-700 font-medium" : "text-gray-700"}`}>{option}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {currentQuiz.isSubmitted && <p className="text-lg font-semibold text-green-700">Your Score: {currentQuiz.score} / {card.questions.length}</p>}

//       <div className="flex justify-end">
//         <Button
//           onClick={handleSubmit}
//           disabled={currentQuiz.isSubmitted}
//           className={`${currentQuiz.isSubmitted ? "cursor-not-allowed opacity-60" : ""} px-6 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg`}
//         >
//           {currentQuiz.isSubmitted ? "Submitted" : "Submit"}
//         </Button>
//       </div>
//       {currentQuiz.isSubmitted && (
//         <div className="space-y-6">
//           <p className="text-lg font-semibold text-gray-700">Quiz Summary</p>
//           {card.questions.map((q, index) => (
//             <Card key={index}>
//               <CardContent className="p-4">
//                 <div className="flex items-start gap-3">
//                   <Badge variant="outline" className="mt-1">
//                     Q{index + 1}
//                   </Badge>
//                   <div className="flex-1">
//                     <p className="font-medium text-lg mb-3">{q.question}</p>
//                     <div className="space-y-2">
//                       {q.options.map((option, idx) => (
//                         <div
//                           key={idx}
//                           className={`p-3 rounded-lg ${
//                             q.correctAnswer === idx
//                               ? "bg-green-50 border-green-200"
//                               : selectedAnswers[index] === idx
//                               ? "bg-red-50 border-red-200"
//                               : "bg-gray-50 border-gray-200"
//                           }`}
//                         >
//                           <p
//                             className={`${
//                               q.correctAnswer === idx
//                                 ? "text-green-700 font-medium"
//                                 : selectedAnswers[index] === idx
//                                 ? "text-red-700 font-medium"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             {option}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizView;
