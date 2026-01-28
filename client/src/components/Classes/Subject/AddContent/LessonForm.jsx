import React from "react";

const LessonForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Lesson Title"
        value={formData?.title}
        className="w-full border rounded p-2"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <input
        type="text"
        placeholder="Lesson URL"
        value={formData?.content}
        className="w-full border rounded p-2"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, content: e.target.value }))
        }
      />
    </div>
  );
};

export default LessonForm;
