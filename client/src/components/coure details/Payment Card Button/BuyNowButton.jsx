import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { enrollStudentInCourse, getCourseById } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ScheduleSelector from "../ScheduleSelector";
import { createPaymentIntent } from "@/services/paymentService";

const BuyNowButton = ({ courseId, onEnrollmentSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loggedinUser } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  useEffect(() => {
    // Fetch course details
    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const paymentPayload = {
    amount: course?.price,
    userId: loggedinUser?.user._id,
    courseId,
    email: loggedinUser?.user.email,
    phone: loggedinUser?.user.mobile,
    username: loggedinUser?.user.name,
    address: loggedinUser?.user.address,
  };

  const generatePaymentLink = async () => {
    try {
      const res = await createPaymentIntent(paymentPayload);

      const paylmentLink = res[1].Click2Pay;

      if (paylmentLink) {
        window.open(paylmentLink, "_blank");
      }
    } catch (error) {
      console.log("Error while generating payment link", error);
    }
  };

  const handleEnrollment = async () => {
    if (!loggedinUser) {
      toast({
        title: "Error",
        description: "Please login to enroll in the course",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (course?.courseType === "One-to-One") {
      setIsModalOpen(true); // Open schedule selection modal
      return;
    }

    // Normal enrollment for other course types
    // enroll(courseId);
    // setIsPaymentModalOpen(true);
    generatePaymentLink();
  };

  const enroll = async (courseId, schedule = null) => {
    try {
      setLoadingEnroll(true);
      const payload = {
        studentId: loggedinUser?.user._id,
      };

      if (schedule) {
        payload.selectedSchedule = schedule;
      }

      if (loggedinUser.token && loggedinUser.user.role === "student") {
        await enrollStudentInCourse(courseId, payload, loggedinUser?.token);
      }

      // Call the callback to refresh parent component
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess();
      }

      toast({
        title: "Success!",
        description: "You have successfully enrolled in this course",
        variant: "success",
        className: "bg-green-500 text-white",
      });

      navigate(`/learner-page/${courseId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoadingEnroll(false);
    }
  };

  const confirmSchedule = async () => {
    if (!selectedSchedule) {
      toast({
        title: "Error",
        description: "Please select a schedule",
        variant: "destructive",
      });
      return;
    }
    try {
      // Wait for the enrollment API to complete before closing the modal
      // await enroll(courseId, selectedSchedule);
      // setIsPaymentModalOpen(true);
      setIsModalOpen(false);
    } catch (error) {
      // Enrollment error is already handled in enroll()
      // Optionally, keep the modal open for the user to retry
    }
  };

  return (
    <>
      <Button
        onClick={handleEnrollment}
        className="bg-orange-500 w-full hover:bg-orange-600"
      >
        Enroll Now
      </Button>

      {/* Modal for Schedule Selection */}
      {course?.courseType === "One-to-One" && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Schedule</DialogTitle>
            </DialogHeader>
            <ScheduleSelector
              schedules={course.oneToOneSchedules}
              selectedSchedule={selectedSchedule}
              onScheduleSelect={setSelectedSchedule}
              instructorTimezone={course.timezone}
            />
            <Button
              onClick={confirmSchedule}
              className="bg-orange-500 w-full mt-4 hover:bg-orange-600"
              disabled={loadingEnroll}
            >
              {loadingEnroll ? "proceeding..." : "Confirm & proceed to payment"}
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal for Payment
      {isPaymentModalOpen && (
        <PaymentForm
          amount={course?.price}
          studentId={loggedinUser?.user._id}
          courseId={courseId}
          onPaymentSuccess={enroll}
        />
      )} */}
    </>
  );
};

export default BuyNowButton;
