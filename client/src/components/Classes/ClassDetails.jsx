import ClassService from "@/services/classService";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import SubjectsList from "./SubjectsList";
import StudentsList from "./StudentsList";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const ClassDetails = () => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const { toast } = useToast();
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const role = loggedinUser?.user?.role;
  const isEnrolled = classDetails?.students?.some(
    (student) =>
      student?._id?.toString() === loggedinUser?.user?._id?.toString()
  );

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
    }
    fetchClassDetails();
  }, [id]);

  const handleEnrollment = async () => {
    try {
      await ClassService.enrollStudentInClass(id, loggedinUser?.token);
      const response = await ClassService.getClassById(id);
      setClassDetails(response);
      setSubjects(response.subjects || []);
      toast({
        title: "Success!",
        description: `You are now enrolled in class ${classDetails.name} `,
        variant: "success",
      });
    } catch (error) {
      console.log("Failed to enroll");
      toast({
        title: "Error!",
        description: `Failed to  enrolled in class ${classDetails.name} `,
        variant: "destructive",
      });
    }
  };

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      // Fetch class details by id
      const response = await ClassService.getClassById(id);
      console.log(response);

      setClassDetails(response);
      setSubjects(response.subjects || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError("Failed to load class details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const refreshSubjects = async () => {
    try {
      const response = await ClassService.getClassById(id);
      setSubjects(response.subjects || []);
      setClassDetails((prevDetails) => ({
        ...prevDetails,
        subjects: response.subjects || [],
      }));
    } catch (error) {
      console.error("Error refreshing subjects:", error);
      toast({
        title: "Error",
        description: "Failed to refresh subjects.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">Loading class details...</div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!classDetails) {
    return <div className="p-4">No class details found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-12">
      <ClassHeader
        name={classDetails.name}
        description={classDetails.description}
      />
      {role === "student" &&
        ((classDetails?.students || []).some(
          (student) =>
            student?._id?.toString() === loggedinUser?.user?._id?.toString()
        ) ? (
          <p className="text-green-500 mt-4 font-semibold">
            You are enrolled in this class as a student
          </p>
        ) : (
          <div className="mt-4 border-b pb-4 flex justify-end">
            <Button
              onClick={handleEnrollment}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Enroll in Class Now
            </Button>
          </div>
        ))}

      <div>
        <SubjectsList
          subjects={classDetails.subjects || []}
          classId={id}
          refreshSubjects={refreshSubjects}
          isEnrolled={isEnrolled}
        />
      </div>
      <div>
        {role && role !== "student" && (
          <StudentsList students={classDetails.students || []} />
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
