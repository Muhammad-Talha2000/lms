// // import React from "react";
// // import { AiFillThunderbolt } from "react-icons/ai";
// // import team1 from "../../assets/img/team1.png";
// // import team2 from "../../assets/img/team2.png";
// // import team3 from "../../assets/img/team3.png";
// // import team4 from "../../assets/img/team4.png";

// // const InstructorsDetails = () => {
// //   const instructors = [
// //     {
// //       id: 1,
// //       image: team1,
// //       name: "Zaramane Mass Likan",
// //       tag: "Online Teacher",
// //     },
// //     {
// //       id: 2,
// //       image: team2,
// //       name: "Amellia Grace Lilly",
// //       tag: "Online Teacher",
// //     },
// //     {
// //       id: 3,
// //       image: team3,
// //       name: "Mason Logan Dee",
// //       tag: "Online Teacher",
// //     },
// //     {
// //       id: 3,
// //       image: team4,
// //       name: "Isabella Smith",
// //       tag: "Online Teacher",
// //     },
// //   ];

// //   return (
// //     <div className="bg-[#e8f0f3] py-16 mt-16">
// //       <div className="container mx-auto px-4">
// //         <div className="flex flex-col items-center">
// //           {/* Welcome Section */}
// //           <div className="flex items-center">
// //             <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
// //               <div className="p-1 bg-[#daf2f0] rounded-full">
// //                 <AiFillThunderbolt color="#ea580c" />
// //               </div>
// //               Welcome to Online Education
// //             </span>
// //           </div>

// //           {/* Heading */}
// //           <h2 className="text-3xl font-bold mt-4 text-center">
// //             Get to know about our world class teachers
// //           </h2>

// //           {/* Instructors Grid */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
// //             {instructors.map((instructor) => (
// //               <div
// //                 key={instructor.id}
// //                 className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full"
// //               >
// //                 <a href="#">
// //                   <img
// //                     className="rounded-t-lg w-full h-40 object-cover"
// //                     src={instructor.image}
// //                     alt={instructor.name}
// //                   />
// //                 </a>
// //                 <div className="p-5">
// //                   <h5 className="mb-2 text-normal font-bold tracking-tight text-gray-900 dark:text-white">
// //                     {instructor.name}
// //                   </h5>
// //                   <p className="mb-3 font-semibold text-xs text-orange-500 dark:text-gray-400">
// //                     {instructor.tag}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InstructorsDetails;

// import React, { useEffect, useRef } from "react";
// import { AiFillThunderbolt } from "react-icons/ai";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";
import team1 from "../../assets/img/team1.png";
import team2 from "../../assets/img/team2.png";
import team3 from "../../assets/img/team3.png";
import team4 from "../../assets/img/team4.png";
// import { getAllUsers } from "@/services/authService";

// const instructors = [
//   { id: 1, image: team1, name: "Zarama Mass Likan", tag: "Online Teacher" },
//   { id: 2, image: team2, name: "Amellia Grace Lilly", tag: "Online Teacher" },
//   { id: 3, image: team3, name: "Mason Logan Dee", tag: "Online Teacher" },
//   { id: 4, image: team4, name: "Isabella Smith", tag: "Online Teacher" },
//   { id: 5, image: team4, name: "Isabella Smith", tag: "Online Teacher" },
// ];

// useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const data = await getAllUsers(loggedinUser.token);
//       console.log("Fetched Users:", data);
//       setUsers(data.users || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUsers();
// }, []);

// const InstructorsDetails = () => {
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (carouselRef.current) {
//         carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-[#e8f0f3] py-16 mt-16">
//       <div className="container mx-auto px-4 flex flex-col items-center">
//         {/* Welcome Section */}
//         <div className="flex items-center">
//           <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
//             <div className="p-1 bg-[#daf2f0] rounded-full">
//               <AiFillThunderbolt color="#ea580c" />
//             </div>
//             Welcome to Online Education
//           </span>
//         </div>

//         {/* Heading */}
//         <h2 className="text-3xl font-bold mt-4 text-center">
//           Get to know about our world-class teachers
//         </h2>

//         {/* Carousel */}
//         <div className="w-full max-w-4xl mt-8" ref={carouselRef}>
//           <Carousel>
//             <CarouselContent>
//               {instructors.map((instructor) => (
//                 <CarouselItem
//                   key={instructor.id}
//                   className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
//                 >
//                   <Card className="border border-gray-200 shadow-lg rounded-lg overflow-hidden">
//                     <img
//                       className="w-full h-40 object-cover"
//                       src={instructor.image}
//                       alt={instructor.name}
//                     />
//                     <CardContent className="p-5 text-center">
//                       <h5 className="text-lg font-bold text-gray-900 dark:text-white">
//                         {instructor.name}
//                       </h5>
//                       <p className="text-orange-500 font-semibold text-xs mt-1">
//                         {instructor.tag}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious />
//             <CarouselNext />
//           </Carousel>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructorsDetails;

// import React, { useEffect, useState, useRef } from "react";
// import { AiFillThunderbolt } from "react-icons/ai";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";
// import { getAllUsers } from "@/services/authService";
// import { useSelector } from "react-redux";

// const InstructorsDetails = () => {
//   const [instructors, setInstructors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { loggedinUser } = useSelector((state) => state.auth);
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const fetchInstructors = async () => {
//       try {
//         const data = await getAllUsers(loggedinUser.token);
//         console.log("Fetched Users:", data);

//         // Filter users to get only instructors
//         const instructorList = data.users.filter(
//           (user) => user.role === "instructor"
//         );

//         setInstructors(instructorList);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInstructors();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (carouselRef.current) {
//         carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-[#e8f0f3] py-16 mt-16">
//       <div className="container mx-auto px-4 flex flex-col items-center">
//         {/* Welcome Section */}
//         <div className="flex items-center">
//           <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
//             <div className="p-1 bg-[#daf2f0] rounded-full">
//               <AiFillThunderbolt color="#ea580c" />
//             </div>
//             Welcome to Online Education
//           </span>
//         </div>

//         {/* Heading */}
//         <h2 className="text-3xl font-bold mt-4 text-center">
//           Get to know about our world-class teachers
//         </h2>

//         {/* Loading State */}
//         {loading ? (
//           <p className="mt-8 text-lg font-semibold">Loading instructors...</p>
//         ) : instructors.length === 0 ? (
//           <p className="mt-8 text-lg font-semibold">No instructors found.</p>
//         ) : (
//           // Carousel
//           <div className="w-full max-w-4xl mt-8" ref={carouselRef}>
//             <Carousel>
//               <CarouselContent>
//                 {instructors.map((instructor) => (
//                   <CarouselItem
//                     key={instructor.id}
//                     className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
//                   >
//                     <Card className="border border-gray-200 shadow-lg rounded-lg overflow-hidden">
//                       <img
//                         className="w-full h-40 object-cover"
//                         src={instructor.profileImage || "/default-avatar.png"} // Provide default image
//                         alt={instructor.name}
//                       />
//                       <CardContent className="p-5 text-center">
//                         <h5 className="text-lg font-bold text-gray-900 dark:text-white">
//                           {instructor.name}
//                         </h5>
//                         <p className="text-orange-500 font-semibold text-xs mt-1">
//                           {instructor.title || "Instructor"}{" "}
//                           {/* Show title if available */}
//                         </p>
//                       </CardContent>
//                     </Card>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//               <CarouselPrevious />
//               <CarouselNext />
//             </Carousel>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InstructorsDetails;

import React, { useEffect, useState, useRef } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicInstructors } from "@/services/authService";

const staticInstructors = [
  {
    id: 1,
    profileImage: team1,
    name: "Zarama Mass Likan",
    title: "Lead curriculum architect",
  },
  {
    id: 2,
    profileImage: team2,
    name: "Amellia Grace Lilly",
    title: "Live facilitation specialist",
  },
  {
    id: 3,
    profileImage: team3,
    name: "Mason Logan Dee",
    title: "Senior subject-matter coach",
  },
  {
    id: 4,
    profileImage: team4,
    name: "Isabella Smith",
    title: "Hybrid classroom mentor",
  },
];

const InstructorsDetails = () => {
  const [instructors, setInstructors] = useState(staticInstructors);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getPublicInstructors();
        const instructorList = data?.instructors || [];
        if (instructorList.length > 0) {
          setInstructors(instructorList);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#e8f0f3] py-12 sm:py-16 mt-12 sm:mt-16 w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col items-center max-w-full min-w-0">
        {/* Welcome Section */}
        <div className="flex items-center">
          <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
            <div className="p-1 bg-[#daf2f0] rounded-full">
              <AiFillThunderbolt color="#ea580c" />
            </div>
            Expert-led instruction at scale
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-center px-2 break-words">
          Meet the educators shaping every cohort experience
        </h2>

        {/* Loading State */}
        {loading ? (
          <p className="mt-8 text-lg font-semibold">Gathering faculty profiles…</p>
        ) : (
          // Carousel
          <div
            className="w-full max-w-full sm:max-w-4xl mt-8 px-1 sm:px-0 min-w-0"
            ref={carouselRef}
          >
            <Carousel>
              <CarouselContent>
                {instructors.map((instructor) => (
                  <CarouselItem
                    key={instructor._id || instructor.id}
                    className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card className="border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                      <img
                        className="w-full h-40 object-cover"
                        src={instructor.profileImage || "/default-avatar.png"}
                        alt={instructor.name}
                      />
                      <CardContent className="p-5 text-center">
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                          {instructor.name}
                        </h5>
                        <p className="text-orange-500 font-semibold text-xs mt-1">
                          {instructor.title || "Faculty mentor"}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorsDetails;
