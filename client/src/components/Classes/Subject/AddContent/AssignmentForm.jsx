import React from "react";

const AssignmentForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Assignment Title"
        value={formData?.title}
        className="w-full border rounded p-2"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <textarea
        placeholder="Assignment Description"
        className="w-full border rounded p-2"
        value={formData?.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <input
        type="date"
        className="w-full border rounded p-2"
        value={formData?.dueDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
        }
      />
    </div>
  );
};

export default AssignmentForm;
