// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Upload, X } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const LANGUAGES = ["English", "Urdu"];
// const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// const CourseFormData = ({course,}) => {

//   return (
    
//     <div className="flex-1 overflow-auto no-scrollbar p-6">
//         <h1 className="text-3xl font-bold mb-6 text-orange-500">
//           {/* {course.name || "Untitled Course"} */}
//         </h1>
//         <Card>
//           <CardContent className="p-6 space-y-4">
//             {course.thumbnail && (
//               <img
//                 src={course.thumbnail}
//                 alt="Course Thumbnail"
//                 className="w-full h-40 object-cover rounded-lg mb-4"
//               />
//             )} 
//             <div>
//               <Label>Description</Label>
//               <div
//                 className="mt-2 p-4 border rounded bg-gray-50"
//                 dangerouslySetInnerHTML={{ __html: course.description }}
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Price</Label>
//                 <p className="">
//                     ${course.price}
//                     </p>
//               </div>
//               <div>
//                 <Label>Duration</Label>
//                 <p className="">
//                   {course.duration}
//                 </p>
//               </div>
//               <div>
//                 <Label>Language</Label>
//                 <p className="">
//                   {course.language}
//                 </p>
//               </div>
//               <div>
//                 <Label>Course Level</Label>
//                 <p className="text-md">
//                   {course.courseLevel}
//                 </p>
//               </div>
//             </div>
//             <div>
//               <Label className="text-orange-500">Tags</Label>
           
//               <p className="flex ">
//                 {/* {course.tags.join(',')} */}
//                 {course.tags.map((tag, index) => (
//                     <p className="" key={index}>{tag}, </p>
//                     ))}

//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//   );
// };

// export default CourseFormData;
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaTags } from "react-icons/fa6";
import { HiOutlineCalendar } from "react-icons/hi2";
import { LuBookText } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
// import courDetails from "../../assets/img/bg-img/course-details.png";
import { BsPerson } from "react-icons/bs";
import { Card } from "@/components/ui/card";
import { SlHome } from "react-icons/sl";
// import VideoPlayer from "../Videos Player/VideoPlayer";

const CourseFormData = ({course,}) =>  {
//   const { id } = useParams(); // Get course ID from URL
//   const [course, setCourse] = useState(null); // Initialize as null
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const data = await getCourseById(id);
//         setCourse(data);
//       } catch (error) {
//         console.error("Error fetching course:", error);
//         setError("Failed to load course details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCourse(); // Call fetch function when id changes
//     }
//   }, [id]);

//   if (loading) return <p>Loading course details...</p>;
//   if (error) return <p>{error}</p>;
//   if (!course) return <p>No course found.</p>;

//   const videoJsOptions = {
//     autoplay: true,
//     controls: true,
//     responsive: true,
//     fluid: true, // Ensures responsiveness
//     sources: [
//       {
//         src: "https://vjs.zencdn.net/v/oceans.mp4",
//         type: "video/mp4",
//       },
//     ],
//   };

//   const handlePlayerReady = (player) => {
//     console.log("Player is ready!", player);
//     // Example: Listen to player events
//     player.on("play", () => {
//       console.log("Video started playing");
//     });
//   };
if (!course) {
    return <div>No course data available</div>;
  }
  return (
        <>
      {/* <PageHeader /> */}
      <div className="w-full flex-1 p-8 justify-center my-6">
      <div className="max-w-full mx-auto">
        {/* Left Section */}
        <Card className="w-full  bg-white  shadow-md rounded-lg">
          {/* Header with Image */}
          <div className="p-6">
            <div className="relative mb-4">
            {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt="Course Thumbnail"
          className="w-full h-[60vh] object-cover rounded-lg mb-4"
        />
      ) : (
        <div>No thumbnail available</div>
      )}
            </div>
            <div className="p- flex space-x-2 mb-3">
              <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                👍
              </span>
              <span className="bg-orange-400 text-white text-sm px-3 py-1 rounded">
                👎
              </span>
            </div>
            {/* Course Title and Meta */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">
                {/* {course.name} */}
                </h1>
              
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t">
            <ul className="flex bg-gray-100  space-x-4 center-center  border-b items-center justify-evenly ">
              <li className="w-1/4 flex gap-2 items-center text-orange-500 font-bold p-4 border-r-2">
                <CiBookmark />
                Price <span className="text-gray-500">${course.price}</span>
              </li>
              <li className="w-1/4 flex gap-2 items-center text-gray-500 border-r-2 p-4">
                <LuBookText />
                Duration <span className="text-gray-500">{course.duration}</span>
              </li>
              <li className="w-1/4 flex gap-2 items-center text-gray-500 border-r-2 p-4">
                <BsPerson />
                Language <span className="text-gray-500">{course.language}</span>
              </li>
              <li className="w-1/4 flex gap-2 items-center text-gray-500 p-4">
                <FaRegStar />
                Level <span className="text-gray-500">{course.courseLevel}</span>
              </li>
            </ul>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          </div>
        </Card>
        </div>

      </div>
    
    </>
  );
}

export default CourseFormData;
