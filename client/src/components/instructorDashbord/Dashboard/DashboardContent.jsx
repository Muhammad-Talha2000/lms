import React, { useEffect, useMemo, useState } from "react";
import Genres from "./Genres";
import TopCourses from "./TopCourses";
import UpcmingTasks from "./UpcmingTasks";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { getCourses } from "@/services/courseService";

const DashboardContent = ({ onViewAllTasks = () => {} }) => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (isMounted) {
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (isMounted) {
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const instructorCourses = useMemo(() => {
    const instructorId = loggedinUser?.user?._id;
    if (!instructorId) return [];

    return courses.filter((course) => {
      const courseInstructorId =
        typeof course.instructor === "string"
          ? course.instructor
          : course.instructor?._id;
      return courseInstructorId?.toString() === instructorId?.toString();
    });
  }, [courses, loggedinUser?.user?._id]);

  const stats = useMemo(() => {
    const liveCourses = instructorCourses.filter(
      (course) => course.courseType === "Live"
    ).length;
    const totalVideos = instructorCourses.reduce(
      (total, course) => total + (course.lessons?.length || 0),
      0
    );
    const uniqueStudents = new Set(
      instructorCourses.flatMap((course) =>
        (course.enrolledStudents || []).map((student) =>
          typeof student === "string" ? student : student?._id
        )
      )
    );
    const earnings = instructorCourses.reduce(
      (total, course) =>
        total + (Number(course.price) || 0) * (course.enrolledStudents?.length || 0),
      0
    );

    return {
      liveCourses,
      totalVideos,
      totalStudents: uniqueStudents.size,
      earnings,
    };
  }, [instructorCourses]);

  const topCourses = useMemo(() => {
    return [...instructorCourses]
      .sort(
        (a, b) =>
          (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)
      )
      .slice(0, 3);
  }, [instructorCourses]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const tasks = [];

    instructorCourses.forEach((course) => {
      (course.assignments || []).forEach((assignment) => {
        if (!assignment?.dueDate) return;
        const due = new Date(assignment.dueDate);
        if (Number.isNaN(due.getTime()) || due < now) return;
        tasks.push({
          id: assignment._id || `${course._id}-assignment-${assignment.title}`,
          title: assignment.title || "Assignment",
          courseName: course.name || "Untitled course",
          dueAt: due,
          type: "assignment",
        });
      });

      (course.quizzes || []).forEach((quiz) => {
        if (!quiz?.dueDate) return;
        const due = new Date(quiz.dueDate);
        if (Number.isNaN(due.getTime()) || due < now) return;
        tasks.push({
          id: quiz._id || `${course._id}-quiz-${quiz.title}`,
          title: quiz.title || "Quiz",
          courseName: course.name || "Untitled course",
          dueAt: due,
          type: "quiz",
        });
      });
    });

    return tasks.sort((a, b) => a.dueAt - b.dueAt).slice(0, 5);
  }, [instructorCourses]);

  const earningsLabel = isLoading
    ? "..."
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(stats.earnings);

  return (
    <main className="flex flex-col gap-6 lg:gap-8 w-full max-w-full min-w-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        <Genres
          title="Live Courses"
          description={isLoading ? "..." : String(stats.liveCourses)}
        />
        <Genres
          title="Videos"
          description={isLoading ? "..." : String(stats.totalVideos)}
          Icon={MdOutlineVideoLibrary}
          padding={2}
        />
        <Genres
          title="Students"
          description={isLoading ? "..." : String(stats.totalStudents)}
          Icon={HiUsers}
          padding={2}
        />
        <Genres
          title="Earning"
          description={earningsLabel}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 w-full min-w-0">
        <div className="flex-1 min-w-0">
          <TopCourses courses={topCourses} isLoading={isLoading} />
        </div>
        <div className="flex-1 min-w-0 lg:max-w-md">
          <UpcmingTasks
            tasks={upcomingTasks}
            isLoading={isLoading}
            onViewAllTasks={onViewAllTasks}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
