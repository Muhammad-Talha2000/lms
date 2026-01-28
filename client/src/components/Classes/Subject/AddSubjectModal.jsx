// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { getAllUsers } from "@/services/authService";
// import { uploadImageToCloudinary } from "@/services/cloudinaryService";
// import { useToast } from "@/hooks/use-toast";
// import SubjectService from "@/services/subjectService";
// import LiveScheduleForm from "./AddContent/LiveScheduleForm";
// import ThumbnailUploader from "./AddContent/TumbnailUploader";

// const AddSubjectModal = ({ onClose, classId, token, onSubjectCreated }) => {
//   const { toast } = useToast();
//   const [instructors, setInstructors] = useState([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [instructor, setInstructor] = useState("");
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [liveSchedules, setLiveSchedules] = useState([]);

//   useEffect(() => {
//     const fetchInstructors = async () => {
//       try {
//         const response = await getAllUsers(token);
//         const fetchedInstructors = response.users.filter(
//           (user) => user.role === "instructor"
//         );
//         setInstructors(fetchedInstructors);
//       } catch (error) {
//         console.error("Error fetching instructors:", error);
//       }
//     };

//     fetchInstructors();
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !description || !instructor || !thumbnailFile) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Validate schedules
//     for (const schedule of liveSchedules) {
//       if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
//         toast({
//           title: "Error",
//           description: "Please complete all schedule fields.",
//           variant: "destructive",
//         });
//         return;
//       }
//       if (schedule.startTime >= schedule.endTime) {
//         toast({
//           title: "Error",
//           description: `Invalid time range for ${schedule.dayOfWeek}.`,
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       let thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);

//       const payload = {
//         name,
//         description,
//         thumbnail: thumbnailUrl,
//         instructor,
//         liveSchedules,
//       };

//       const response = await SubjectService.createSubject(
//         classId,
//         payload,
//         token
//       );

//       console.log(response);

//       if (response?.subject) {
//         toast({
//           title: "Subject Created",
//           description: "Subject added successfully!",
//           variant: "success",
//         });
//         if (onSubjectCreated) onSubjectCreated(response.subject);
//         onClose();
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (error) {
//       const errorMessage =
//         error?.response?.data?.message || "Failed to create subject.";

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose} className="max-h-60">
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Subject</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-6 ">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="Enter subject name"
//             className="w-full border rounded-md p-2"
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//             placeholder="Enter subject description"
//             className="w-full border rounded-md p-2"
//           />
//           <select
//             value={instructor}
//             onChange={(e) => setInstructor(e.target.value)}
//             required
//             className="w-full border rounded-md p-2"
//           >
//             <option value="">Select instructor</option>
//             {instructors.map((inst) => (
//               <option key={inst._id} value={inst._id}>
//                 {inst.name}
//               </option>
//             ))}
//           </select>
//           <ThumbnailUploader setThumbnailFile={setThumbnailFile} />
//           <LiveScheduleForm
//             liveSchedules={liveSchedules}
//             setLiveSchedules={setLiveSchedules}
//           />
//           <Button
//             type="submit"
//             disabled={loading}
//             className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
//           >
//             {loading ? "Creating..." : "Create Subject"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddSubjectModal;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/services/authService";
import { uploadImageToCloudinary } from "@/services/cloudinaryService";
import { useToast } from "@/hooks/use-toast";
import SubjectService from "@/services/subjectService";
import LiveScheduleForm from "./AddContent/LiveScheduleForm";
import ThumbnailUploader from "./AddContent/TumbnailUploader";

const AddSubjectModal = ({ onClose, classId, token, onSubjectCreated }) => {
  const { toast } = useToast();
  const [instructors, setInstructors] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveSchedules, setLiveSchedules] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await getAllUsers(token);
        const fetchedInstructors = response.users.filter(
          (user) => user.role === "instructor"
        );
        setInstructors(fetchedInstructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, [token]);

  // Separate function to validate schedules
  const validateSchedules = () => {
    // Only validate schedules if there are any to validate
    if (liveSchedules.length === 0) {
      return true; // No schedules to validate is valid
    }

    for (const schedule of liveSchedules) {
      if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
        toast({
          title: "Error",
          description: "Please complete all schedule fields.",
          variant: "destructive",
        });
        return false;
      }
      if (schedule.startTime >= schedule.endTime) {
        toast({
          title: "Error",
          description: `Invalid time range for ${schedule.dayOfWeek}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !instructor || !thumbnailFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Call the separate validation function only when submitting the form
    if (!validateSchedules()) {
      return;
    }

    setLoading(true);
    try {
      let thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);

      const payload = {
        name,
        description,
        thumbnail: thumbnailUrl,
        instructor,
        liveSchedules, // Sending schedules as part of the payload
      };

      const response = await SubjectService.createSubject(
        classId,
        payload,
        token
      );

      console.log(response);

      if (response?.subject) {
        toast({
          title: "Subject Created",
          description: "Subject added successfully!",
          variant: "success",
        });
        if (onSubjectCreated) onSubjectCreated(response.subject);
        onClose();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create subject.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose} className="max-h-60">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter subject name"
            className="w-full border rounded-md p-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter subject description"
            className="w-full border rounded-md p-2"
          />
          <select
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
            className="w-full border rounded-md p-2"
          >
            <option value="">Select instructor</option>
            {instructors.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.name}
              </option>
            ))}
          </select>
          <ThumbnailUploader setThumbnailFile={setThumbnailFile} />
          <LiveScheduleForm
            liveSchedules={liveSchedules}
            setLiveSchedules={setLiveSchedules}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            {loading ? "Creating..." : "Create Subject"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectModal;
