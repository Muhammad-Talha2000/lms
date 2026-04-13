import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ClassTable = ({
  classes,
  onEdit,
  onDelete,
  onRowClick,
  isLoading,
  showDelete = true,
}) => {
  if (isLoading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No classes found. Create your first class to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="font-serif font-semibold">
              Class Name
            </TableHead>
            <TableHead className="font-serif font-semibold">
              Description
            </TableHead>
            <TableHead className="font-serif font-semibold text-right">
              Price
            </TableHead>
            <TableHead className="font-serif font-semibold text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow
              key={classItem._id}
              onClick={() => onRowClick(classItem._id)}
              className="cursor-pointer hover:bg-gray-50 border-b transition-colors"
            >
              <TableCell className="font-medium">{classItem.name}</TableCell>
              <TableCell className="text-gray-700 truncate max-w-xs">
                {classItem.description}
              </TableCell>
              <TableCell className="text-right font-medium">
                {Number(classItem.price)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(classItem);
                    }}
                  >
                    Edit
                  </Button>
                  {showDelete && onDelete ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 hover:bg-red-50 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(classItem);
                      }}
                    >
                      Delete
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassTable;
