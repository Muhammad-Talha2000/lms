// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   resetCourse,
//   updateFormData,
//   updateStep,
// } from "../../../redux/courseSlice";
// import { Card, CardContent } from "@/components/ui/card";
// import BasicInfo from "./BasicInfo";
// import ThumbnailUpload from "./ThumbnailUpload";
// import CourseDetails from "./CourseDetails";
// import LessonsManager from "./LessonsManager";
// import StepIndicator from "./StepIndicator";
// import { createCourse } from "@/services/courseService";
// import { useToast } from "@/hooks/use-toast";

// const AddCourseContent = () => {
//   const dispatch = useDispatch();
//   const { step, formData } = useSelector((state) => state.course);
//   const { token } = useSelector((state) => state.auth.loggedinUser);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const handleInputChange = (e) => {
//     if (!e) return;

//     // Handle rich text editor (ReactQuill) input
//     if (typeof e === "object" && "field" in e) {
//       dispatch(
//         updateFormData({
//           field: e.field,
//           value: e.value,
//         })
//       );
//       return;
//     }

//     const { name, value } = e.target;
//     dispatch(
//       updateFormData({
//         name,
//         value,
//       })
//     );
//   };

//   const handleThumbnailChange = (file) => {
//     dispatch(
//       updateFormData({
//         field: "thumbnail",
//         value: file,
//       })
//     );
//   };

//   const handleLessonsChange = (newLessons) => {
//     dispatch(
//       updateFormData({
//         field: "lessons",
//         value: newLessons,
//       })
//     );
//   };

//   const validateStep = () => {
//     switch (step) {
//       case 1:
//         // Check if the required fields are filled and not just empty strings
//         if (
//           !formData.name?.trim() ||
//           !formData.description?.trim() ||
//           !formData.price?.toString()?.trim()
//         ) {
//           alert(
//             "Please fill in all required fields (Name, Description, and Price)"
//           );
//           return false;
//         }
//         break;
//       case 2:
//         if (!formData.thumbnail) {
//           alert("Please upload a thumbnail");
//           return false;
//         }
//         break;
//       case 3:
//         if (!formData.language?.trim()) {
//           alert("Please specify the course language");
//           return false;
//         }

//         break;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;

//     try {
//       setIsSubmitting(true);
//       console.log("Submitting:", formData);

//       const data = await createCourse(formData, token);
//       console.log(data);

//       // Reset the form

//       dispatch(resetCourse());
//       toast({
//         title: "Success!",
//         description: "Course created successfully",
//         className: "bg-green-500 text-white",
//       });
//       setIsSubmitting(false);
//     } catch (error) {
//       console.error("Error while creating course:", error);
//       toast({
//         title: "Error!",
//         description: error.message || "Failed to create course",
//         className: "bg-red-500 text-white",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderCurrentStep = () => {
//     switch (step) {
//       case 1:
//         return <BasicInfo formData={formData} onChange={handleInputChange} />;
//       case 2:
//         return (
//           <ThumbnailUpload
//             onFileSelect={handleThumbnailChange}
//             currentThumbnail={formData.thumbnail}
//           />
//         );
//       case 3:
//         return (
//           <CourseDetails formData={formData} onChange={handleInputChange} />
//         );
//       case 4:
//         return (
//           <LessonsManager
//             lessons={formData.lessons}
//             onChange={handleLessonsChange}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       dispatch(updateStep(step + 1));
//     }
//   };

//   const handlePrevious = () => {
//     dispatch(updateStep(step - 1));
//   };

//   return (
//     <div className="w-full mx-auto ">
//       <Card>
//         <CardContent className="pt-6">
//           <form className="space-y-6">
//             <StepIndicator currentStep={step} totalSteps={4} />

//             {renderCurrentStep()}

//             <div className="flex justify-between mt-6">
//               {step > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
//                 >
//                   Previous
//                 </button>
//               )}
//               {step < 4 ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   type="submit"
//                   className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                 >
//                   Create Course
//                 </button>
//               )}
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddCourseContent;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCourse,
  updateFormData,
  updateStep,
} from "../../../redux/courseSlice";
import { Card, CardContent } from "@/components/ui/card";
import CourseTypeSelection from "./CourseTypeSelection";
import BasicInfo from "./BasicInfo";
import ThumbnailUpload from "./ThumbnailUpload";
import CourseDetails from "./CourseDetails";
import LessonsManager from "./LessonsManager";
import StepIndicator from "./StepIndicator";
import { createCourse } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

const AddCourseContent = () => {
  const dispatch = useDispatch();
  const { step, formData } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth.loggedinUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    if (!e) return;

    if (typeof e === "object" && "field" in e) {
      dispatch(updateFormData({ field: e.field, value: e.value }));
      return;
    }

    const { name, value } = e.target;
    dispatch(updateFormData({ field: name, value }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.courseType?.trim()) {
          alert("Please select a course type");
          return false;
        }
        break;
      case 2:
        if (
          !formData.name?.trim() ||
          !formData.description?.trim() ||
          !formData.price?.toString()?.trim()
        ) {
          alert(
            "Please fill in all required fields (Name, Description, and Price)"
          );
          return false;
        }
        break;
      case 3:
        if (!formData.thumbnail) {
          alert("Please upload a thumbnail");
          return false;
        }
        break;
      case 4:
        if (!formData.language?.trim()) {
          alert("Please specify the course language");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setIsSubmitting(true);
      console.log("Submitting:", formData);

      const data = await createCourse(formData, token);
      console.log(data);

      dispatch(resetCourse());
      toast({
        title: "Success!",
        description: "Course created successfully",
        className: "bg-green-500 text-white",
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error while creating course:", error);
      toast({
        title: "Error!",
        description: error.message || "Failed to create course",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <CourseTypeSelection
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 2:
        return <BasicInfo formData={formData} onChange={handleInputChange} />;
      case 3:
        return (
          <ThumbnailUpload
            onFileSelect={(file) =>
              handleInputChange({ field: "thumbnail", value: file })
            }
            currentThumbnail={formData.thumbnail}
          />
        );
      case 4:
        return (
          <CourseDetails formData={formData} onChange={handleInputChange} />
        );
      case 5:
        return (
          <LessonsManager
            lessons={formData.lessons}
            onChange={(newLessons) =>
              handleInputChange({ field: "lessons", value: newLessons })
            }
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      dispatch(updateStep(step + 1));
    }
  };

  const handlePrevious = () => {
    dispatch(updateStep(step - 1));
  };

  return (
    <div className="w-full mx-auto">
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <StepIndicator currentStep={step} totalSteps={5} />

            {renderCurrentStep()}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
                >
                  Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Create Course
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourseContent;
