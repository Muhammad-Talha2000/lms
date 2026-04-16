import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { getCourses } from "@/services/courseService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StudentsContent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});
  const { loggedinUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const allCourses = await getCourses();
        const instructorCourses = allCourses.filter(
          (course) => course.instructor._id === loggedinUser.user._id
        );
        setCourses(instructorCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      setLoading(false);
    };

    loadCourses();
  }, [loggedinUser]);

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const getStudentActivities = (course, studentId) => {
    const quizAttempts = course.quizzes.flatMap((quiz) =>
      quiz.attempts
        .filter((attempt) => attempt.student.toString() === studentId)
        .map((attempt) => ({
          ...attempt,
          quizTitle: quiz.title,
          totalQuestions: quiz.questions.length,
        }))
    );

    const assignmentSubmissions = course.assignments.flatMap((assignment) =>
      assignment.submissions
        .filter((sub) => sub.student.toString() === studentId)
        .map((sub) => ({
          ...sub,
          assignmentTitle: assignment.title,
          dueDate: assignment.dueDate,
        }))
    );

    return { quizAttempts, assignmentSubmissions };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <h2 className="text-2xl font-bold text-orange-500">Students Overview</h2>

      <Dialog
        open={!!selectedActivity}
        onOpenChange={() => setSelectedActivity(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedActivity?.type === "quiz" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedActivity.data.quizTitle} Attempt
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Score:</p>
                    <p>
                      {selectedActivity.data.score}/
                      {selectedActivity.data.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Attempt Date:</p>
                    <p>
                      {new Date(
                        selectedActivity.data.timestamp
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedActivity?.type === "assignment" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedActivity.data.assignmentTitle} Submission
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Submission Date:</p>
                    <p>
                      {new Date(
                        selectedActivity.data.submittedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Status:</p>
                    <Badge
                      className={
                        selectedActivity.data.status === "late"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }
                    >
                      {selectedActivity.data.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Submission File:</p>
                  <a
                    href={selectedActivity.data.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    View Submission
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {courses?.length === 0 ? (
        <p className="text-gray-600 mt-4">No courses found.</p>
      ) : (
        <Tabs defaultValue={courses[0]?._id} className="mt-6 min-w-0">
          <div className="overflow-x-auto pb-1">
            <TabsList className="p-1 rounded-lg inline-flex min-w-max">
            {courses.map((course) => (
              <TabsTrigger
                key={course._id}
                value={course._id}
                className="px-3 sm:px-4 py-2 font-medium whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 text-gray-600"
              >
                {course.name}
              </TabsTrigger>
            ))}
            </TabsList>
          </div>

          {courses.map((course) => (
            <TabsContent key={course._id} value={course._id}>
              <Card className="mt-4 border-orange-500 w-full max-w-full min-w-0">
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold text-orange-500">
                    {course.name} - Students
                  </h3>

                  {course.enrolledStudents.length === 0 ? (
                    <p className="text-gray-600 mt-4">No students enrolled.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {course.enrolledStudents.map((student) => {
                        const activities = getStudentActivities(
                          course,
                          student._id
                        );
                        const isExpanded = expandedStudents[student._id];

                        return (
                          <div
                            key={student._id}
                            className="bg-orange-50 p-3 rounded-lg border border-orange-200 min-w-0"
                          >
                            <div
                              className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center cursor-pointer min-w-0"
                              onClick={() =>
                                toggleStudentExpansion(student._id)
                              }
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-orange-600 break-words">
                                  {student.name}
                                </p>
                                <p className="text-sm text-gray-500 break-all">
                                  {student.email}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center min-w-0">
                                <Badge className="bg-blue-100 text-blue-600 whitespace-nowrap">
                                  Quizzes: {activities.quizAttempts.length}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-600 whitespace-nowrap">
                                  Assignments:{" "}
                                  {activities.assignmentSubmissions.length}
                                </Badge>
                                {isExpanded ? <ChevronUp /> : <ChevronDown />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-4 space-y-4">
                                {/* Quiz Attempts Section */}
                                <div>
                                  <h4 className="font-medium text-orange-500 mb-2">
                                    Quiz Attempts
                                  </h4>
                                  {activities.quizAttempts.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                      No quiz attempts
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {activities.quizAttempts.map(
                                        (attempt, index) => (
                                          <div
                                            key={index}
                                            className="p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                              setSelectedActivity({
                                                type: "quiz",
                                                data: attempt,
                                              })
                                            }
                                          >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center min-w-0">
                                              <span className="break-words">{attempt.quizTitle}</span>
                                              <Badge className="bg-green-100 text-green-600 w-fit">
                                                Score: {attempt.score}/
                                                {attempt.totalQuestions}
                                              </Badge>
                                            </div>
                                            {/* <p className="text-xs text-gray-500">
                                              {new Date(
                                                attempt.timestamp
                                              ).toLocaleDateString()}
                                            </p> */}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Assignment Submissions Section */}
                                <div>
                                  <h4 className="font-medium text-orange-500 mb-2">
                                    Assignment Submissions
                                  </h4>
                                  {activities.assignmentSubmissions.length ===
                                  0 ? (
                                    <p className="text-gray-500 text-sm">
                                      No assignment submissions
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {activities.assignmentSubmissions.map(
                                        (sub, index) => (
                                          <div
                                            key={index}
                                            className="p-2 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                              setSelectedActivity({
                                                type: "assignment",
                                                data: sub,
                                              })
                                            }
                                          >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center min-w-0">
                                              <span className="break-words">{sub.assignmentTitle}</span>
                                              <Badge
                                                className={
                                                  sub.status === "late"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                }
                                              >
                                                {sub.status}
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                              Submitted:{" "}
                                              {new Date(
                                                sub.submittedAt
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default StudentsContent;
