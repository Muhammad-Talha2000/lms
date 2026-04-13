import React, { useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";

const SubjectCardItem = ({ subject, isInstructor, onSelect }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const thumb =
    typeof subject?.thumbnail === "string" ? subject.thumbnail.trim() : "";
  const hasThumb = Boolean(thumb) && !imgFailed;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        group flex w-full min-w-0 gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm
        transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
        ${
          isInstructor
            ? "border-emerald-200/90 hover:border-emerald-300"
            : "border-gray-200/90 hover:border-orange-200"
        }
      `}
    >
      <div
        className={`
          relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24
          ${isInstructor ? "bg-emerald-50 ring-2 ring-emerald-100" : "bg-gray-100 ring-2 ring-gray-100"}
        `}
      >
        {hasThumb ? (
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <BookOpen className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pr-1">
        <p
          className={`text-base font-semibold leading-snug sm:text-lg break-words ${
            isInstructor ? "text-emerald-950" : "text-gray-900"
          }`}
        >
          {subject.name}
        </p>
        {subject?.description ? (
          <div
            className="subject-html-desc min-w-0 max-h-[4.5rem] max-w-full overflow-hidden text-xs leading-relaxed text-gray-600 sm:max-h-[5.5rem] sm:text-sm [&_*]:max-w-full [&_img]:h-auto [&_img]:max-h-20 [&_img]:max-w-full [&_img]:rounded-md [&_img]:object-contain [&_p]:my-1 [&_p:first-child]:mt-0 [&_ul]:list-disc [&_ul]:pl-4"
            dangerouslySetInnerHTML={{ __html: subject.description }}
          />
        ) : (
          <p className="text-xs text-gray-500 sm:text-sm">No description</p>
        )}
      </div>

      <div className="flex shrink-0 self-center text-gray-400 transition-colors group-hover:text-orange-500">
        <ChevronRight className="h-5 w-5" aria-hidden />
      </div>
    </button>
  );
};

export default SubjectCardItem;
