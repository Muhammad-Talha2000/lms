import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const UpcmingTasks = ({
  tasks = [],
  isLoading = false,
  onViewAllTasks = () => {},
}) => {
  const formatTaskDate = (date) =>
    new Intl.DateTimeFormat("en-PK", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);

  return (
    <div className="w-full max-w-full min-w-0 px-3 sm:px-6 lg:px-8">
      <h1 className="font-semibold text-3xl mb-8">Upcoming Tasks</h1>
      {isLoading ? (
        <div className="my-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          Loading upcoming tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="my-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          No upcoming dated tasks found in your courses.
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="border-l-4 border-orange-500 pl-4 my-4">
            <h1 className="font-semibold text-lg break-words">{task.title}</h1>
            <p className="text-sm text-gray-600 break-words">{task.courseName}</p>
            <p className="text-sm text-gray-700 mt-1">
              Due {formatTaskDate(task.dueAt)} ({task.type})
            </p>
          </div>
        ))
      )}
      <button
        type="button"
        onClick={onViewAllTasks}
        className="text-orange-500 justify-end flex gap-4 font-bold items-center mt-4 cursor-pointer hover:text-orange-600 w-full"
      >
        View all Tasks <FaLongArrowAltRight />
      </button>
    </div>
  );
};

export default UpcmingTasks;
