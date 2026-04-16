import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import AddSubjectModal from "./Subject/AddSubjectModal";
import SubjectCardItem from "./SubjectCardItem";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SubjectsList = ({ subjects, classId, refreshSubjects, isEnrolled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loggedinUser } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const role = loggedinUser?.user?.role;

  const navigate = useNavigate();
  const currentUserId = loggedinUser?.user?._id?.toString();

  const visibleSubjects =
    role === "instructor"
      ? (subjects || []).filter((subject) => {
          const subInst = subject?.instructor?._id ?? subject?.instructor;
          return subInst?.toString() === currentUserId;
        })
      : subjects || [];

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

      const subInst = subject.instructor?._id ?? subject.instructor;
      if (
        role === "instructor" &&
        subInst?.toString() !== loggedinUser?.user?._id?.toString()
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
    <section className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Learning content
          </p>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Subjects
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Open a subject to view lessons and materials.
          </p>
        </div>
        {role === "admin" && (
          <Button
            onClick={handleOpenModal}
            className="h-11 shrink-0 gap-2 rounded-xl bg-orange-500 px-5 hover:bg-orange-600 w-full sm:w-auto"
          >
            <FaPlus />
            Add subject
          </Button>
        )}
      </div>

      {visibleSubjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">
            {role === "instructor"
              ? "No subjects are assigned to you in this class yet."
              : "No subjects in this class yet."}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {role === "admin"
              ? "Use Add subject to create one."
              : role === "instructor"
              ? "Subjects assigned to you will appear here."
              : "Check back later."}
          </p>
        </div>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 min-w-0 p-0 m-0">
          {visibleSubjects.map((subject, index) => {
            const inst = subject?.instructor?._id ?? subject?.instructor;
            const isInstructor =
              inst?.toString() === loggedinUser?.user?._id?.toString();

            return (
              <li
                key={subject._id || subject.id || index}
                className="min-w-0"
              >
                <SubjectCardItem
                  subject={subject}
                  isInstructor={isInstructor}
                  onSelect={() => handleNavigate(subject)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {isModalOpen && loggedinUser?.token && (
        <AddSubjectModal
          onClose={handleCloseModal}
          classId={classId}
          token={loggedinUser.token}
          onSubjectCreated={handleSubjectCreated}
        />
      )}
    </section>
  );
};

export default SubjectsList;
