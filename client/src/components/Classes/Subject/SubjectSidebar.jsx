import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import SidebarAccordians from "./SidebarAccordians";

const SubjectSidebar = ({
  subject,
  setView,
  setSelectedCard,
  refetchSubjectDetails,
  onItemSelect,
}) => {
  const [thumbError, setThumbError] = useState(false);

  return (
    <div className="h-full min-h-0 w-full min-w-0 rounded-none border-r border-gray-200 bg-white p-3 shadow-none sm:p-4 lg:w-80 lg:rounded-2xl lg:border lg:border-gray-200/90 lg:shadow-sm">
      <div className="space-y-3">
        <h1 className="break-words text-lg font-bold leading-tight text-orange-700 sm:text-xl">
          {subject.name}
        </h1>
        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
          {subject.thumbnail && !thumbError ? (
            <img
              src={subject.thumbnail}
              alt=""
              className="h-40 w-full object-cover object-center sm:h-48"
              onError={() => setThumbError(true)}
            />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-slate-100 text-gray-400 sm:h-48">
              <BookOpen className="h-12 w-12" strokeWidth={1.25} />
              <span className="text-xs text-gray-500">No cover image</span>
            </div>
          )}
        </div>
      </div>

      <div className="my-4 min-w-0 space-y-1 pb-6">
        <SidebarAccordians
          type="Content Library"
          content={{ data: subject.contentLibrary, type: "Content" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
          onItemSelect={onItemSelect}
        />
        <SidebarAccordians
          type="lessons"
          content={{ data: subject.lessons, type: "Lessons" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
          onItemSelect={onItemSelect}
        />
        <SidebarAccordians
          type="Assignments"
          content={{ data: subject.assignments, type: "Assignments" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
          onItemSelect={onItemSelect}
        />
        <SidebarAccordians
          type="Quizzes"
          content={{ data: subject.quizzess, type: "Quizzes" }}
          setView={setView}
          setSelectedCard={setSelectedCard}
          subjectId={subject._id}
          refetchSubjectDetails={refetchSubjectDetails}
          onItemSelect={onItemSelect}
        />
      </div>
    </div>
  );
};

export default SubjectSidebar;
