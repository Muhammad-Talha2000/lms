import React from "react";
import { User } from "lucide-react";

const StudentsList = ({ students }) => {
  if (!students.length) {
    return (
      <section className="min-w-0 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
          Students
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          No students enrolled in this class.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10 min-w-0 overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
        Students{" "}
        <span className="font-normal text-gray-500">({students.length})</span>
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Roster for this class (visible to instructors and admins).
      </p>

      <div className="mt-5 space-y-3 md:hidden">
        {students.map((student, index) => (
          <div
            key={student._id || student.id || index}
            className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <User className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-semibold text-gray-900 break-words">
                {student.name}
              </p>
              <p className="break-all text-gray-600">{student.email}</p>
              <p className="text-gray-600">
                <span className="text-gray-400">Phone · </span>
                {student.mobile || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 hidden md:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr key={student._id || student.id || index}>
                <td className="px-3 lg:px-6 py-3">
                  <User className="w-6 h-6 text-gray-500" />
                </td>
                <td className="px-3 lg:px-6 py-3 font-medium text-gray-900 break-words max-w-[10rem] lg:max-w-none">
                  {student.name}
                </td>
                <td className="px-3 lg:px-6 py-3 text-gray-500 break-all max-w-[12rem] lg:max-w-xs">
                  {student.email}
                </td>
                <td className="px-3 lg:px-6 py-3 text-gray-500 whitespace-nowrap">
                  {student.mobile || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StudentsList;
