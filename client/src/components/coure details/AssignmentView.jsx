import React, { useState, useEffect } from "react";
import { File, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { uploadFileToCloudinary } from "@/services/cloudinaryService";
import {
  submitAssignment,
  getAssignmentSubmission,
} from "@/services/courseService";
import { useSelector } from "react-redux";

const AssignmentView = ({ card, courseId, onAssignmentSubmit }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState(null);
  const { loggedinUser } = useSelector((state) => state.auth);
  const description = card.description;
  const dueDate = card.dueDate;

  useEffect(() => {
    setSubmission(null);
    fetchSubmission();
  }, [card._id]);

  const fetchSubmission = async () => {
    try {
      const response = await getAssignmentSubmission(
        courseId,
        card._id,
        loggedinUser.token
      );
      setSubmission(response);
    } catch (error) {
      console.error("Error fetching submission:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      return;
    }

    const isPastDue = new Date() > new Date(dueDate);
    if (isPastDue) {
      return alert("Assignment submission is past due.");
    }

    setLoading(true);
    try {
      // Upload file to Cloudinary
      const fileUrl = await uploadFileToCloudinary(file);
      console.log(fileUrl);

      // Submit assignment with the Cloudinary URL
      await submitAssignment(courseId, card._id, fileUrl, loggedinUser.token);

      await fetchSubmission();
      setFile(null);
      if (onAssignmentSubmit) {
        onAssignmentSubmit();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-t-2xl">
        <h2 className="text-lg font-bold text-gray-700">
          {submission ? "Assignment Submitted" : "Submit Your Assignment"}
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
          <div className="flex items-center gap-2 text-sm">
            <Badge
              variant="outline"
              className={`${
                new Date() > new Date(dueDate)
                  ? "text-red-500 border-red-200 bg-red-50"
                  : "text-orange-500 border-orange-200 bg-orange-50"
              }`}
            >
              Due: {new Date(dueDate).toLocaleDateString()}
            </Badge>
          </div>

          {submission ? (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-600">
                Submitted on:{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Submission
              </a>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex items-center gap-2 cursor-pointer text-orange-500 border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <File className="w-5 h-5" />
                <span className="font-medium">
                  {file ? file.name : "Select Assignment File"}
                </span>
              </label>
              <Button
                disabled={!file || loading}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Assignment
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentView;
