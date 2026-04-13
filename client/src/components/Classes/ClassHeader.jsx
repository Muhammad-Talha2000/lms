import React from "react";
import { BookOpen } from "lucide-react";

const ClassHeader = ({ name, description, thumbnail }) => {
  return (
    <header className="min-w-0 mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-orange-100/90 bg-gradient-to-br from-orange-50 via-white to-amber-50/40 px-5 py-6 sm:px-8 sm:py-8 shadow-sm">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-200/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-amber-200/25 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          {thumbnail ? (
            <div className="shrink-0 overflow-hidden rounded-xl border border-orange-100/90 bg-white shadow-sm">
              <img
                src={thumbnail}
                alt=""
                className="aspect-video w-full max-w-full object-cover sm:h-28 sm:w-44"
              />
            </div>
          ) : null}
          <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
            <BookOpen className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600/90">
              Class
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl break-words leading-tight">
              {name}
            </h1>
            <div className="mt-4 rounded-xl border border-orange-100/80 bg-white/70 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                About
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base break-words whitespace-pre-wrap">
                {description || "No description has been added for this class yet."}
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClassHeader;
