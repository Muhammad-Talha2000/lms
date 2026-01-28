import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const AssignmentSubmissionView = ({ assignment }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { subjectId } = useParams();
  const userToken = useSelector((state) => state.auth.token);

  const handleSubmit = async () => {
    if (!fileUrl.trim()) {
      alert("Please provide a file URL");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `/api/subjects/${subjectId}/assignment/${assignment._id}/submit`,
        { fileUrl },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert(error.response?.data?.message || "Assignment submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-bold">{assignment.title}</h2>
        <p className="text-gray-600">{assignment.description}</p>
        <Input
          type="text"
          placeholder="Enter file URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Assignment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignmentSubmissionView;
