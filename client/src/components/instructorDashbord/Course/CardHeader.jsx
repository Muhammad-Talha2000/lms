// import React from "react";
// import { ArrowLeft, Edit, Trash, TypeIcon } from "lucide-react";

// const CardHeader = ({ title, type, onBack, onEdit, onDelete }) => (
//   <div className="flex items-center justify-end gap-3">
//     <div className="flex items-center gap-2">
//       <button
//         onClick={onEdit}
//         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//       >
//         <Edit className="w-5 h-5" />
//       </button>
//       <button
//         onClick={onDelete}
//         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//       >
//         <Trash className="w-5 h-5" />
//       </button>
//     </div>
//   </div>
// );

// export default CardHeader;

import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const CardHeader = ({ title, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDialogOpen(false); // Close the dialog
    onDelete(); // Trigger the delete action
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
        {/* Alert Dialog for Delete Confirmation */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-bold">{title}</span>? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)} // Close dialog without deleting
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CardHeader;
