import React, { useState } from "react";
import { Plus, X, Check } from "lucide-react";

const LessonsManager = ({ lessons, onChange }) => {
  const [newLesson, setNewLesson] = useState(null); // Holds data for the lesson being added
  const [isAdding, setIsAdding] = useState(false); // Controls button state

  // Initialize lessons as an empty array if not passed correctly
  if (!Array.isArray(lessons)) {
    lessons = [];
  }

  const handleAddLesson = () => {
    if (!isAdding) {
      setNewLesson({ title: "", content: "" });
      setIsAdding(true);
    }
  };

  const handleSaveLesson = () => {
    if (newLesson && newLesson.title.trim() && newLesson.content.trim()) {
      onChange([...lessons, newLesson]);
      setNewLesson(null);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewLesson(null);
    setIsAdding(false);
  };

  const removeLesson = (index) => {
    onChange(lessons.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Heading & Add Lesson Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Course Lessons</h3>
        <button
          type="button"
          onClick={handleAddLesson}
          disabled={isAdding}
          className={`flex items-center gap-1 px-3 py-1 rounded-md ${
            isAdding
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </button>
      </div>

      {/* New Lesson Form (Only One at a Time) */}
      {newLesson && (
        <div className="p-4 border rounded-md space-y-3 bg-gray-50">
          <input
            type="text"
            value={newLesson.title}
            onChange={(e) =>
              setNewLesson({ ...newLesson, title: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:outline-orange-500"
            placeholder="Lesson title"
          />
          <input
            type="text"
            value={newLesson.content}
            onChange={(e) =>
              setNewLesson({ ...newLesson, content: e.target.value })
            }
            className="w-full p-2 border rounded-md  focus:outline-orange-500 "
            placeholder="Video URL"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 text-gray-500 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveLesson}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Display Added Lessons */}
      {lessons.length > 0 ? (
        lessons.map((lesson, index) => (
          <div key={index} className="p-4 border rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{lesson.title}</h4>
                <p className="text-gray-600 text-sm">{lesson.content}</p>
              </div>
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">No lessons added yet.</p>
      )}
    </div>
  );
};

export default LessonsManager;
