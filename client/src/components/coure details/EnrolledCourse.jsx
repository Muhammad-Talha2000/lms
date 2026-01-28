import React from "react";
import {
  ArrowLeft,
  FileText,
  Video,
  CheckSquare,
  ExternalLink,
  Image as ImageIcon,
  Download,
  File,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import QuizView from "./QuizView";
import AssignmentView from "./AssignmentView";
import { Button } from "@radix-ui/themes";
import DiscussionBox from "./Discussion box/DiscussionBox";

const TypeIcon = ({ type }) => {
  const iconProps = { className: "w-5 h-5", strokeWidth: 1.5 };
  switch (type) {
    case "quiz":
      return <CheckSquare {...iconProps} className="text-purple-500" />;
    case "lesson":
      return <Video {...iconProps} className="text-blue-500" />;
    case "content":
      return <FileText {...iconProps} className="text-green-500" />;
    default:
      return null;
  }
};

const VideoPlayer = ({ url }) => {
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const youtubeId = isYouTube ? getYouTubeId(url) : null;

  if (isYouTube && youtubeId) {
    return (
      <div className="aspect-w-16 h-[60vh]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          className="w-full h-full rounded-xl shadow-lg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return (
      <video
        controls
        className="w-full rounded-xl shadow-lg"
        style={{ maxHeight: "70vh" }}
      >
        <source src={url} type={`video/${url.split(".").pop()}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="text-center p-6 bg-gray-50 rounded-xl">
      <Video className="w-12 h-12 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-600">Video format not supported in preview.</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open Video in New Tab
      </a>
    </div>
  );
};

const LessonView = ({ title, content }) => (
  <div className="space-y-4">
    <VideoPlayer url={content} />
    <p className="text-sm text-gray-500 mt-2">Video content for {title}</p>
  </div>
);

// const FilePreview = ({ url, type }) => {
//   const fileType = type.toLowerCase();
//   const fileExtension = url.split(".").pop().toLowerCase();

//   // For images
//   if (fileType.includes("image") || /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
//     return (
//       <div className="border rounded-xl overflow-hidden bg-gray-50">
//         <img
//           src={url}
//           alt="File preview"
//           className="max-w-full h-auto mx-auto"
//           style={{ maxHeight: "500px" }}
//         />
//       </div>
//     );
//   }

//   // For PDFs
//   if (fileType.includes("pdf") || fileExtension === "pdf") {
//     return (
//       <div className="border rounded-xl overflow-hidden bg-gray-50">
//         <embed src={url} type="application/pdf" className="w-full h-[500px]" />
//       </div>
//     );
//   }

//   // For text files
//   if (fileType.includes("text") || /\.(txt|md|rtf)$/i.test(url)) {
//     return (
//       <div className="border rounded-xl p-4 bg-gray-50 font-mono text-sm overflow-auto max-h-[500px]">
//         <pre>{url}</pre>
//       </div>
//     );
//   }

//   // For documents
//   if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url)) {
//     return (
//       <div className="text-center p-6 bg-gray-50 rounded-xl">
//         <File className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//         <p className="text-gray-600 mb-4">Document preview not available</p>
//         <div className="flex justify-center gap-4">
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//           >
//             <ExternalLink className="w-4 h-4" />
//             Open
//           </a>
//           <a
//             href={url}
//             download
//             className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             Download
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // Default fallback for other file types
//   return (
//     <div className="text-center p-6 bg-gray-50 rounded-xl">
//       <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//       <p className="text-gray-600 mb-2">File type: {type || "Unknown"}</p>
//       <div className="flex justify-center gap-4">
//         <a
//           href={url}
//           download
//           className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
//         >
//           <Download className="w-4 h-4" />
//           Download File
//         </a>
//       </div>
//     </div>
//   );
// };

const FilePreview = ({ url, type }) => {
  const isPdf =
    type.toLowerCase().includes("pdf") || url.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-xl">
        <File className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Only PDF files are supported</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-gray-50">
      {/* Use object tag instead of embed for better control */}
      <object
        data={`${url}#toolbar=0&navpanes=0`}
        type="application/pdf"
        className="w-full h-[500px]"
        style={{
          // Allow scrolling but prevent selection and other interactions
          userSelect: "none",
          // Optional: if you want to prevent right-click
          WebkitTouchCallout: "none",
        }}
      >
        <div className="text-center p-6">
          <p className="text-gray-600">
            Unable to display PDF. Please check if the file is accessible.
          </p>
        </div>
      </object>
      <div className="p-4 border-t bg-white">
        <p className="text-sm text-gray-500">
          PDF Preview Mode - View and scroll only
        </p>
      </div>
    </div>
  );
};

const ContentView = ({ name, type, url }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-500" />
        <p className="text-sm text-gray-600">File Type: {type}</p>
      </div>
      <FilePreview url={url} type={type} />
    </CardContent>
  </Card>
);

const EnrolledCourse = ({ selectedCard, onBack, courseId }) => {
  if (!selectedCard) return null;

  const { type, card } = selectedCard;
  console.log(selectedCard);

  const handleQuizSubmit = () => {
    setQuizUpdateTrigger((prev) => !prev); // Toggle state to re-trigger sidebar update
  };
  const handleAssignmentSubmit = () => {
    setAssignmentUpdateTrigger((prev) => !prev); // Toggle state to re-trigger sidebar update
  };

  const renderContent = () => {
    switch (type) {
      case "quiz":
        return (
          <QuizView
            key={card._id}
            card={card}
            courseId={courseId}
            onQuizSubmit={handleQuizSubmit}
          />
        );
      case "lesson":
        return <LessonView title={card.title} content={card.content} />;
      case "content":
        return <ContentView name={card.name} type={card.type} url={card.url} />;
      case "assignment":
        return (
          <AssignmentView
            key={card._id}
            card={card}
            courseId={courseId}
            onAssignmentSubmit={handleAssignmentSubmit}
          />
        );
      default:
        return <p className="text-gray-700">No details available.</p>;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-3">
            <TypeIcon type={type} />
            <h1 className="text-2xl font-semibold text-gray-900">
              {card.title || card.name}
            </h1>
          </div>

          <div className="mt-6 space-y-6">
            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourse;
