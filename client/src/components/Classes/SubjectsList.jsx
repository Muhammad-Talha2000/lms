import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import AddSubjectModal from "./Subject/AddSubjectModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SubjectsList = ({ subjects, classId, refreshSubjects, isEnrolled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loggedinUser } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const role = loggedinUser.user.role;

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubjectCreated = (newSubject) => {
    // Call the refresh method passed from parent component
    if (refreshSubjects) {
      refreshSubjects();
    }
  };
  const handleNavigate = async (subject) => {
    try {
      if (role === "student" && !isEnrolled) {
        toast({
          title: "Error",
          description: "You need to enroll in the class first to view",
          variant: "destructive",
        });
        return; // Prevent further execution
      }

      if (
        role === "instructor" &&
        subject.instructor !== loggedinUser.user._id
      ) {
        toast({
          title: "Error",
          description: "You are not the instructor for this subject",
          variant: "destructive",
        });
        return; // Prevent further execution
      }

      navigate(`/subject/${subject._id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-6 border-b pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Subjects</h2>
        {role && role === "admin" && (
          <Button
            onClick={handleOpenModal}
            className="mb-4 bg-orange-500 hover:bg-orange-600 gap-2"
          >
            <FaPlus />
            Add Subject
          </Button>
        )}
      </div>
      <Card className="shadow-md border border-gray-200">
        {subjects.length !== 0 && (
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => {
              const isInstructor =
                subject?.instructor === loggedinUser?.user?._id; // ✅ Define isInstructor here

              return (
                <div
                  key={subject.id || index}
                  onClick={() => handleNavigate(subject)}
                  className={`flex items-center p-3 gap-4 rounded-lg transition-colors cursor-pointer mb-3
              ${
                isInstructor
                  ? "bg-green-100 hover:bg-green-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={
                        subject.thumbnail ||
                        "https://cor-cdn-static.bibliocommons.com/assets/default_covers/icon-book-93409e4decdf10c55296c91a97ac2653.png"
                      }
                      alt={subject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <p
                      className={`text-lg font-bold ${
                        isInstructor ? "text-black" : "text-gray-900"
                      }`}
                    >
                      {subject.name}
                    </p>
                    <p
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: subject?.description }}
                    ></p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        )}
      </Card>

      {isModalOpen && (
        <AddSubjectModal
          onClose={handleCloseModal}
          classId={classId}
          token={loggedinUser.token}
          onSubjectCreated={handleSubjectCreated}
        />
      )}
    </div>
  );
};

export default SubjectsList;
