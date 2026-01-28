import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  ExternalLink,
  File,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CardHeader from "./CardHeader";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const TypeIcon = ({ type }) => {
  const iconProps = { className: "w-5 h-5", strokeWidth: 1.5 };
  switch (type) {
    case "quiz":
      return <CheckSquare {...iconProps} className="text-purple-500" />;
    case "lesson":
      return <Video {...iconProps} className="text-blue-500" />;
    case "content":
      return <FileText {...iconProps} className="text-green-500" />;
    case "assignment":
      return <BookOpen {...iconProps} className="text-orange-500" />;
    default:
      return null;
  }
};

export const QuizView = ({ questions }) => (
  <div className="space-y-6">
    {questions.map((q, index) => (
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
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <p
                      className={`${
                        q.correctAnswer === idx
                          ? "text-green-700 font-medium"
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
);

const VideoPlayer = ({ url }) => {
  console.log("Playing video from URL:", url);

  // Extract video ID from different YouTube URL formats
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if URL is YouTube
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const youtubeId = isYouTube ? getYouTubeId(url) : null;

  if (isYouTube && youtubeId) {
    return (
      <div className="aspect-w-16 h-96">
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

  // For direct video files
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

  // For Vimeo videos
  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("/").pop();
    return (
      <div className="aspect-w-16 h-96">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full rounded-xl shadow-lg"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback for unsupported video formats
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

export const LessonView = ({ title, content }) => (
  <div className="space-y-4">
    <VideoPlayer url={content} />
    <p className="text-sm text-gray-500 mt-2">Video content for {title}</p>
  </div>
);

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

export const ContentView = ({ name, type, url }) => (
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

export const AssignmentView = ({ title, description, dueDate }) => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-4">
        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        <div className="flex items-center gap-2 text-sm">
          <Badge
            variant="outline"
            className="text-orange-500 border-orange-200 bg-orange-50"
          >
            Due: {dueDate}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DetailedCardView = ({
  selectedCard,
  onBack,
  handleEditCard,
  handleDeleteCard,
}) => {
  if (!selectedCard) return null;

  const { type, card } = selectedCard;
  console.log(selectedCard);

  const renderContent = () => {
    switch (type) {
      case "quiz":
        return <QuizView questions={card.questions} />;
      case "lesson":
        return <LessonView title={card.title} content={card.content} />;
      case "content":
        return <ContentView name={card.name} type={card.type} url={card.url} />;
      case "assignment":
        return (
          <AssignmentView
            title={card.title}
            description={card.description}
            dueDate={card.dueDate}
          />
        );
      default:
        return <p className="text-gray-700">No details available.</p>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
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

          <div className="mt-6 space-y-6 overflow-y-scroll no-scrollbar ">
            <CardHeader
              title={card.title || card.name}
              type={type}
              onEdit={() => handleEditCard(selectedCard)}
              onDelete={() => handleDeleteCard(selectedCard)}
            />
            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedCardView;
