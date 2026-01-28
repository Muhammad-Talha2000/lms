import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const DeleteCard = ({ onConfirm, isDeleting, title }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onConfirm(); // Call delete function
    setOpen(false);
  };

  return (
    <>
      <Trash
        onClick={() => setOpen(true)}
        className={`w-5 h-5 cursor-pointer text-red-500 ${
          isDeleting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this {title}? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCard;
