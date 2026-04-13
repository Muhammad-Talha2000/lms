import Course from "../models/Courses.js";
import Student from "../models/auth/Student.js";
import { scheduleOneToOneMeeting } from "../controllers/oneToOneMeetingControllers.js";

/**
 * Shared enrollment logic (used by HTTP enroll + Stripe confirmation).
 * @returns {{ ok: true, course: object } | { ok: false, status: number, message: string }}
 */
export async function completeStudentEnrollment({
  courseId,
  studentId,
  selectedSchedule = null,
}) {
  const course = await Course.findById(courseId);
  if (!course) {
    return { ok: false, status: 404, message: "Course not found" };
  }

  const sid = String(studentId);
  const alreadyEnrolled = course.enrolledStudents.some(
    (id) => String(id) === sid
  );
  if (alreadyEnrolled) {
    return {
      ok: false,
      status: 400,
      message: "Already enrolled in this course",
    };
  }

  let scheduleUpdated = false;

  if (course.courseType === "One-to-One" && selectedSchedule) {
    let scheduleFound = false;

    for (const scheduleBlock of course.oneToOneSchedules || []) {
      for (const schedule of scheduleBlock.schedules || []) {
        if (
          schedule.startTime === selectedSchedule?.startTime &&
          schedule.endTime === selectedSchedule?.endTime
        ) {
          scheduleFound = true;

          if (schedule.isBooked || schedule.studentId) {
            return {
              ok: false,
              status: 400,
              message: "This schedule is already taken.",
            };
          }

          schedule.studentId = studentId;
          schedule.isBooked = true;
          scheduleUpdated = true;
        }
      }
    }

    if (!scheduleFound) {
      return {
        ok: false,
        status: 400,
        message: "Invalid schedule selection.",
      };
    }
  }

  course.enrolledStudents.push(studentId);
  await course.save();

  const student = await Student.findById(studentId);
  if (!student) {
    return { ok: false, status: 404, message: "Student not found" };
  }
  student.coursesEnrolled.push(courseId);
  await student.save();

  if (scheduleUpdated) {
    try {
      await scheduleOneToOneMeeting(course);
    } catch (scheduleError) {
      console.error("Failed to schedule meeting:", scheduleError);
    }
  }

  const updatedCourse = await Course.findById(courseId)
    .populate("enrolledStudents")
    .populate("instructor");

  return { ok: true, course: updatedCourse };
}
