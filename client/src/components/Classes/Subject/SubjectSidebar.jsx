import React from "react";
import SidebarAccordians from "./SidebarAccordians";

const SubjectSidebar = ({
  subject,
  setView,
  setSelectedCard,
  refetchSubjectDetails,
}) => {
  return (
    <div className="bg-gray-100 w-80 p-4 h-screen overflow-y-scroll custom-scrollbar">
      <div className="space-y-2">
        <h1 className="font-bold text-xl text-orange-500">{subject.name}</h1>
        <img
          src={subject.thumbnail}
          alt={subject.name}
          className="rounded-lg w-full h-48 object-cover"
        />
      </div>

      <div className="my-4">
        <SidebarAccordians
          type="Content Library"
          content={{ data: subject.contentLibrary, type: "Content" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
        />
        <SidebarAccordians
          type="lessons"
          content={{ data: subject.lessons, type: "Lessons" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
        />
        <SidebarAccordians
          type="Assignments"
          content={{ data: subject.assignments, type: "Assignments" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
        />
        <SidebarAccordians
          type="Quizzes"
          content={{ data: subject.quizzess, type: "Quizzes" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
        />
      </div>
    </div>
  );
};

export default SubjectSidebar;
