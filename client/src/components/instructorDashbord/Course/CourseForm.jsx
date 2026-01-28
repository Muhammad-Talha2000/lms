// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Upload, X } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import UploadProgress from "./UploadProgress";

// const LANGUAGES = ["English", "Urdu"];
// const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
// const COURSE_TYPES = ["Recorded", "Live", "One-to-One"];

// const CourseForm = ({
//   course,
//   dragActive,
//   handleInputChange,
//   handleSelectChange,
//   handleDescriptionChange,
//   handleDrag,
//   handleDrop,
//   handleFileInput,
//   removeThumbnail,
//   handleSaveChanges,
//   isUploading,
// }) => {
//   return (
//     <div className="flex-1 overflow-auto no-scrollbar p-6">
//       <h1 className="text-3xl font-bold mb-6 text-orange-500">Manage Course</h1>

//       <div className="space-y-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Course Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={course.name}
//                   onChange={handleInputChange}
//                   className="focus:outline-orange-500 focus:ring-orange-500"
//                 />
//               </div>

//               {/* Thumbnail Upload */}
//               <div>
//                 <Label>Course Thumbnail</Label>
//                 <div
//                   className={`relative border-2 border-dashed rounded-lg p-6 mt-2 text-center cursor-pointer transition-colors
//           ${dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"}
//           hover:border-orange-500 hover:bg-orange-50`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                   onClick={() =>
//                     document.getElementById("thumbnail-upload").click()
//                   }
//                 >
//                   <input
//                     type="file"
//                     id="thumbnail-upload"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleFileInput}
//                   />
//                   {isUploading ? (
//                     <UploadProgress />
//                   ) : course.thumbnail ? (
//                     <div className="relative">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeThumbnail();
//                         }}
//                         className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                       <img
//                         src={course.thumbnail}
//                         alt="Thumbnail preview"
//                         className="max-h-40 mx-auto rounded-lg"
//                       />
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
//                       <p className="text-sm text-gray-600">
//                         Drag and drop your thumbnail here or click to browse
//                       </p>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <div className="mt-2">
//                   <ReactQuill
//                     value={course.description}
//                     onChange={handleDescriptionChange}
//                     theme="snow"
//                     className="focus-within:outline-orange-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="courseLevel">Course Type</Label>
//                 <select
//                   id="courseType"
//                   value={course.courseType}
//                   onChange={(e) =>
//                     handleSelectChange("courseType", e.target.value)
//                   }
//                   className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
//                 >
//                   <option value="" disabled>
//                     Select Type
//                   </option>
//                   {COURSE_TYPES.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="price">Price</Label>
//                   <Input
//                     id="price"
//                     name="price"
//                     type="number"
//                     value={course.price}
//                     onChange={handleInputChange}
//                     className="focus:outline-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="duration">Duration</Label>
//                   <Input
//                     id="duration"
//                     name="duration"
//                     value={course.duration}
//                     onChange={handleInputChange}
//                     className="focus:outline-orange-500"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="language">Language</Label>
//                   <select
//                     id="language"
//                     value={course.language}
//                     onChange={(e) =>
//                       handleSelectChange("language", e.target.value)
//                     }
//                     className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
//                   >
//                     <option value="" disabled>
//                       Select language
//                     </option>
//                     {LANGUAGES.map((lang) => (
//                       <option key={lang} value={lang}>
//                         {lang}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="courseLevel">Course Level</Label>
//                   <select
//                     id="courseLevel"
//                     value={course.courseLevel}
//                     onChange={(e) =>
//                       handleSelectChange("courseLevel", e.target.value)
//                     }
//                     className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
//                   >
//                     <option value="" disabled>
//                       Select level
//                     </option>
//                     {COURSE_LEVELS.map((level) => (
//                       <option key={level} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="tags">Tags (comma-separated)</Label>
//                 <Input
//                   id="tags"
//                   name="tags"
//                   value={course.tags.join(", ")}
//                   onChange={(e) => {
//                     handleInputChange({
//                       target: {
//                         name: "tags",
//                         value: e.target.value,
//                       },
//                     });
//                   }}
//                   className="focus:outline-orange-500"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <div className="flex justify-end mt-4">
//           <Button
//             onClick={handleSaveChanges}
//             className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseForm;

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadProgress from "./UploadProgress";

const LANGUAGES = ["English", "Urdu"];
const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COURSE_TYPES = ["Recorded", "Live", "One-to-One"];

const CourseForm = ({
  course,
  dragActive,
  handleInputChange,
  handleSelectChange,
  handleDescriptionChange,
  handleDrag,
  handleDrop,
  handleFileInput,
  removeThumbnail,
  handleSaveChanges,
  isUploading,
}) => {
  return (
    <div className="flex-1 overflow-auto no-scrollbar p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Manage Course</h1>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={course.name}
                  onChange={handleInputChange}
                  className="focus:outline-orange-500 focus:ring-orange-500"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label>Course Thumbnail</Label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 mt-2 text-center cursor-pointer transition-colors
          ${dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300"}
          hover:border-orange-500 hover:bg-orange-50`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("thumbnail-upload").click()
                  }
                >
                  <input
                    type="file"
                    id="thumbnail-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                  {isUploading ? (
                    <UploadProgress />
                  ) : course.thumbnail ? (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeThumbnail();
                        }}
                        className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={course.thumbnail}
                        alt="Thumbnail preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drag and drop your thumbnail here or click to browse
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <div className="mt-2">
                  <ReactQuill
                    value={course.description}
                    onChange={handleDescriptionChange}
                    theme="snow"
                    className="focus-within:outline-orange-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="courseType">Course Type</Label>
                <select
                  id="courseType"
                  value={course.courseType}
                  onChange={(e) =>
                    handleSelectChange("courseType", e.target.value)
                  }
                  className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
                  disabled={course.courseType !== ""}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {COURSE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleInputChange}
                    className="focus:outline-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={course.duration}
                    onChange={handleInputChange}
                    className="focus:outline-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={course.language}
                    onChange={(e) =>
                      handleSelectChange("language", e.target.value)
                    }
                    className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
                  >
                    <option value="" disabled>
                      Select language
                    </option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="courseLevel">Course Level</Label>
                  <select
                    id="courseLevel"
                    value={course.courseLevel}
                    onChange={(e) =>
                      handleSelectChange("courseLevel", e.target.value)
                    }
                    className="w-full p-2 border rounded bg-orange-50 focus:outline-orange-500"
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    {COURSE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={course.tags.join(", ")}
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: "tags",
                        value: e.target.value,
                      },
                    });
                  }}
                  className="focus:outline-orange-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSaveChanges}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
