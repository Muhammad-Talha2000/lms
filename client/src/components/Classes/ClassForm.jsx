import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const ClassForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Class Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter class name"
          required
          className="border-gray-300"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter class description"
          required
          className="border-gray-300 resize-none"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Price </label>
        <Input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
          min="0"
          step="0.01"
          className="border-gray-300"
        />
      </div>
      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-300"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600"
          disabled={isLoading}
        >
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Class"
            : "Create Class"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ClassForm;
