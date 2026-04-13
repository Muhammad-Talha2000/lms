// import React, { useState, useEffect } from "react";
// import { FaBook } from "react-icons/fa";
// import { AiFillStar } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { getCourses } from "@/services/courseService";
// import { Card } from "@radix-ui/themes";
// import { useSelector } from "react-redux";
// import moment from "moment";

// const StudentEnroll = () => {
//   const [courses, setCourses] = useState([]);
//   const [liveSessions, setLiveSessions] = useState([]);
//   const navigate = useNavigate();
//   const { loggedinUser } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         if (!loggedinUser?.user?._id) {
//           return;
//         }

//         const data = await getCourses();
//         const userId = loggedinUser.user._id.toString();

//         // Get enrolled courses
//         const enrolledCourses = data.filter((course) =>
//           course.enrolledStudents.some(
//             (student) => student._id.toString() === userId
//           )
//         );

//         const validLiveSessions = [];

//         enrolledCourses.forEach((course) => {
//           // Skip courses with no live session
//           if (!course.liveSession || !course.liveSession.meetingLink) {
//             return;
//           }

//           // CASE 1: Group courses (not One-to-One)
//           if (course.courseType !== "One-to-One") {
//             validLiveSessions.push({
//               courseName: course.name,
//               topic: course.liveSession.topic || "Live Class",
//               instructor: course.instructor.name,
//               startTime: course.liveSession.startTime,
//               meetingLink: course.liveSession.meetingLink,
//             });
//           }
//           // CASE 2: One-to-One courses
//           else {
//             // Find sessions booked by this student
//             let matchingSession = null;

//             // Look through all schedule blocks
//             for (const block of course.oneToOneSchedules || []) {
//               // Find sessions booked by this student
//               const studentSessions = (block.schedules || []).filter(
//                 (session) =>
//                   session.isBooked && session.studentId?.toString() === userId
//               );

//               if (studentSessions.length > 0) {
//                 // Found sessions booked by this student
//                 // Now check if the live session is for any of these bookings
//                 // We'll use the startTime from liveSession to match with booked slots
//                 if (course.liveSession.startTime) {
//                   const liveSessionDate = new Date(
//                     course.liveSession.startTime
//                   );

//                   // Format the live session time to match the format in schedules
//                   const liveSessionHour = liveSessionDate.getHours();
//                   const liveSessionMinute = liveSessionDate.getMinutes();
//                   const formattedLiveSessionTime = `${liveSessionHour
//                     .toString()
//                     .padStart(2, "0")}:${liveSessionMinute
//                     .toString()
//                     .padStart(2, "0")}`;

//                   // Find if any of the student's booked sessions match this time
//                   matchingSession = studentSessions.find((session) => {
//                     // Direct time match
//                     return session.startTime === formattedLiveSessionTime;
//                   });

//                   // If no direct match, try a more flexible approach
//                   if (!matchingSession) {
//                     matchingSession = studentSessions.find((session) => {
//                       const [sessionHours, sessionMinutes] = session.startTime
//                         .split(":")
//                         .map(Number);
//                       const sessionTime = new Date(liveSessionDate);
//                       sessionTime.setHours(sessionHours);
//                       sessionTime.setMinutes(sessionMinutes);

//                       // Within 15 minutes
//                       const timeDiff = Math.abs(liveSessionDate - sessionTime);
//                       return timeDiff <= 15 * 60 * 1000;
//                     });
//                   }
//                 }

//                 // If we found a matching session, add the live session for this student
//                 if (matchingSession) {
//                   validLiveSessions.push({
//                     courseName: course.name,
//                     topic: course.liveSession.topic || "One-on-One Session",
//                     instructor: course.instructor.name,
//                     startTime: course.liveSession.startTime,
//                     meetingLink: course.liveSession.meetingLink,
//                   });

//                   // Once we found a match, we can break the loop
//                   break;
//                 }
//               }
//             }
//           }
//         });

//         // Sort sessions by start time
//         const sortedSessions = validLiveSessions.sort(
//           (a, b) => new Date(a.startTime) - new Date(b.startTime)
//         );

//         setCourses(enrolledCourses);
//         setLiveSessions(sortedSessions);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [loggedinUser?.user?._id]);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="container mx-auto">
//         {/* Live Session Notification */}
//         {liveSessions.length > 0 && (
//           <div className="bg-orange-500 p-6 rounded-lg shadow-lg mb-6 border-l-4 border-orange-500 relative overflow-hidden animate-fadeIn">
//             {/* Animated background pulse effect */}
//             <div className="absolute inset-0 bg-orange-100 opacity-50 animate-pulse"></div>

//             {/* Notification glow */}
//             <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500 rounded-full opacity-20 animate-ping"></div>

//             {liveSessions.map((session, index) => (
//               <div key={index} className="mb-6 relative z-10 last:mb-0">
//                 <div className="flex items-start">
//                   {/* Live indicator dot */}
//                   <div className="mr-3 mt-1">
//                     <div className="w-3 h-3 bg-orange-400 rounded-full relative">
//                       <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
//                     </div>
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-orange-200 mb-2 flex items-center">
//                       LIVE SESSION:{" "}
//                       <span className="ml-2 uppercase text-white">
//                         {session.courseName}
//                       </span>
//                     </h3>

//                     <div className="bg-orange-800 bg-opacity-50 p-4 rounded-md mb-3">
//                       <p className="text-orange-50 mb-2">
//                         <span className="font-semibold text-orange-300">
//                           Topic:
//                         </span>{" "}
//                         {session.topic}
//                       </p>
//                       <p className="text-orange-50 mb-2">
//                         <span className="font-semibold text-orange-300">
//                           Instructor:
//                         </span>{" "}
//                         {session.instructor}
//                       </p>
//                       <p className="text-orange-50">
//                         <span className="font-semibold text-orange-300">
//                           Starts at:
//                         </span>{" "}
//                         {new Date(session.startTime).toLocaleString()}
//                       </p>
//                     </div>

//                     <button
//                       className={`group relative overflow-hidden font-bold px-6 py-3 rounded-md transition-all duration-300 ${
//                         new Date(session.startTime) > new Date()
//                           ? "bg-orange-900 text-orange-300 cursor-not-allowed"
//                           : "bg-orange-600 hover:bg-orange-500 text-white"
//                       }`}
//                       disabled={new Date(session.startTime) > new Date()}
//                       onClick={() => window.open(session.meetingLink, "_blank")}
//                     >
//                       {/* Button hover effect */}
//                       <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

//                       {/* Join text with icon */}
//                       <span className="flex items-center justify-center">
//                         {new Date(session.startTime) > new Date() ? (
//                           "Coming Soon"
//                         ) : (
//                           <>
//                             Join Now
//                             <svg
//                               className="ml-2 w-5 h-5 animate-bounce"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//                               />
//                             </svg>
//                           </>
//                         )}
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Heading Section */}
//         <div className="mb-10 text-center">
//           <h2 className="text-3xl font-bold text-gray-800">Enrolled Courses</h2>
//         </div>

//         {/* Courses Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.length > 0 ? (
//             courses.map((course) => (
//               <Card
//                 key={course._id}
//                 className="bg-white border-2 border-gray-200 rounded-2xl cursor-pointer"
//                 onClick={() => navigate(`/learner-page/${course._id}`)}
//               >
//                 <div className="overflow-hidden rounded-2xl p-2">
//                   <img
//                     src={course.thumbnail}
//                     alt={course.name}
//                     className="w-full h-36 object-cover rounded-lg"
//                   />
//                 </div>

//                 <div className="px-4">
//                   <h3 className="text-md font-bold text-gray-800">
//                     {course.name}
//                   </h3>

//                   <div className="flex items-center gap-4 text-orange-500 text-sm mt-2">
//                     <div className="flex items-center gap-1">
//                       <FaBook className="w-4 h-4" />
//                       {course.lessons.length} Lessons
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-evenly my-2 py-2">
//                     <div className="flex items-center gap-2">
//                       <img
//                         src={course.instructor.profileImage}
//                         alt={course.instructor.name}
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <p className="flex flex-col">
//                         <span className="font-semibold text-xs text-gray-500">
//                           {course.instructor.name}
//                         </span>
//                         <span className="text-xs text-orange-500">
//                           Instructor
//                         </span>
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1 text-orange-500 ml-auto">
//                       {[...Array(5)].map((_, index) => (
//                         <AiFillStar key={index} className="w-3 h-3" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center col-span-3">
//               You are not enrolled in any courses yet.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentEnroll;

import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getCourses } from "@/services/courseService";
import { Card } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import moment from "moment";

const StudentEnroll = () => {
  const [courses, setCourses] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const navigate = useNavigate();
  const { loggedinUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!loggedinUser?.user?._id) {
          return;
        }

        const data = await getCourses();
        const userId = loggedinUser.user._id.toString();

        // Get enrolled courses
        const enrolledCourses = data.filter((course) =>
          course.enrolledStudents.some(
            (student) => student._id.toString() === userId
          )
        );

        const validLiveSessions = [];

        enrolledCourses.forEach((course) => {
          // Skip courses with no live session
          if (!course.liveSession || !course.liveSession.meetingLink) {
            return;
          }

          // CASE 1: Group courses (not One-to-One)
          if (course.courseType !== "One-to-One") {
            validLiveSessions.push({
              courseName: course.name,
              topic: course.liveSession.topic || "Live Class",
              instructor: course.instructor.name,
              startTime: course.liveSession.startTime,
              meetingLink: course.liveSession.meetingLink,
            });
          }
          // CASE 2: One-to-One courses
          else {
            // Check that a live session exists with a valid bookingReference.
            if (
              course.liveSession.bookingReference &&
              course.liveSession.meetingLink
            ) {
              let matchingSlot = null;
              // Look through all one-to-one schedule blocks to find the slot
              for (const block of course.oneToOneSchedules || []) {
                const slot = (block.schedules || []).find(
                  (session) =>
                    session._id.toString() ===
                    course.liveSession.bookingReference.toString()
                );
                if (slot) {
                  matchingSlot = slot;
                  break;
                }
              }
              // Only add the live session if the matching slot exists and is booked by the current student
              if (
                matchingSlot &&
                matchingSlot.studentId?.toString() === userId
              ) {
                validLiveSessions.push({
                  courseName: course.name,
                  topic:
                    `One to one session with ${course.instructor.name}` ||
                    "One-on-One Session",
                  instructor: course.instructor.name,
                  startTime: course.liveSession.startTime,
                  meetingLink: course.liveSession.meetingLink,
                });
              }
            }
          }
        });

        // Sort sessions by start time
        const sortedSessions = validLiveSessions.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );

        setCourses(enrolledCourses);
        setLiveSessions(sortedSessions);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [loggedinUser?.user?._id]);

  return (
    <div className="min-w-0 w-full rounded-lg border border-border bg-card p-3 sm:p-6 shadow-sm">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        {/* Live Session Notification */}
        {liveSessions.length > 0 && (
          <div className="relative mb-6 overflow-hidden rounded-lg border-l-4 border-primary bg-primary p-4 sm:p-6 shadow-lg animate-fadeIn">
            {/* Animated background pulse effect */}
            <div className="absolute inset-0 bg-primary/20 opacity-50 animate-pulse" />

            <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-primary opacity-20 animate-ping" />

            {liveSessions.map((session, index) => (
              <div key={index} className="mb-6 relative z-10 last:mb-0">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mr-1 mt-1 shrink-0 sm:mr-0">
                    <div className="relative h-3 w-3 rounded-full bg-primary-foreground/90">
                      <div className="absolute inset-0 rounded-full bg-primary-foreground animate-ping opacity-75" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 flex flex-col gap-1 text-base font-bold text-primary-foreground/95 sm:flex-row sm:flex-wrap sm:items-center sm:text-lg">
                      <span className="shrink-0">LIVE SESSION:</span>
                      <span className="break-words uppercase text-primary-foreground">
                        {session.courseName}
                      </span>
                    </h3>

                    <div className="mb-3 rounded-md bg-black/25 p-3 sm:p-4">
                      <p className="mb-2 break-words text-sm text-primary-foreground/95 sm:text-base">
                        <span className="font-semibold text-primary-foreground">
                          Topic:
                        </span>{" "}
                        {session.topic}
                      </p>
                      <p className="mb-2 break-words text-sm text-primary-foreground/95 sm:text-base">
                        <span className="font-semibold text-primary-foreground">
                          Instructor:
                        </span>{" "}
                        {session.instructor}
                      </p>
                      <p className="break-words text-sm text-primary-foreground/95 sm:text-base">
                        <span className="font-semibold text-primary-foreground">
                          Starts at:
                        </span>{" "}
                        {new Date(session.startTime).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`group relative w-full overflow-hidden rounded-md px-4 py-3 text-sm font-bold transition-all duration-300 sm:w-auto sm:px-6 sm:text-base ${
                        new Date(session.startTime) > new Date()
                          ? "cursor-not-allowed bg-black/40 text-primary-foreground/60"
                          : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      }`}
                      disabled={new Date(session.startTime) > new Date()}
                      onClick={() => window.open(session.meetingLink, "_blank")}
                    >
                      <span className="absolute inset-0 w-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <span className="relative flex items-center justify-center">
                        {new Date(session.startTime) > new Date() ? (
                          "Coming Soon"
                        ) : (
                          <>
                            Join Now
                            <svg
                              className="ml-2 w-5 h-5 animate-bounce"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 text-center sm:mb-10">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
            Enrolled Courses
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Card
                key={course._id}
                className="min-w-0 cursor-pointer rounded-2xl border-2 border-border bg-card transition-shadow hover:shadow-md"
                onClick={() => navigate(`/learner-page/${course._id}`)}
              >
                <div className="overflow-hidden rounded-t-2xl p-2">
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="h-32 w-full rounded-lg object-cover sm:h-36"
                  />
                </div>

                <div className="min-w-0 px-3 pb-3 pt-1 sm:px-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-foreground sm:text-base">
                    {course.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-primary">
                    <div className="flex items-center gap-1">
                      <FaBook className="h-4 w-4 shrink-0" />
                      <span>{course.lessons?.length ?? 0} Lessons</span>
                    </div>
                  </div>
                  <div className="my-2 flex min-w-0 flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={course.instructor.profileImage}
                        alt={course.instructor.name}
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                      <p className="flex min-w-0 flex-col">
                        <span className="truncate text-xs font-semibold text-muted-foreground">
                          {course.instructor.name}
                        </span>
                        <span className="text-xs text-primary">Instructor</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 text-primary sm:ml-auto">
                      {[...Array(5)].map((_, index) => (
                        <AiFillStar key={index} className="h-3 w-3" />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground sm:text-base">
              You are not enrolled in any courses yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnroll;
