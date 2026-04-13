import {
  createAnnouncement,
  getCourseAnnouncents,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcementService";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaPlus, FaRegClock, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Announcements = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { loggedinUser } = useSelector((state) => state.auth);

  // Fetch announcements when the component mounts or courseId changes
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getCourseAnnouncents(courseId);
      if (data) {
        setAnnouncements(data);
      }
    };
    fetchAnnouncements();
  }, [courseId]);

  // Handler to create a new announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const payload = { title, message };

    if (isEditing && currentAnnouncementId) {
      // Update existing announcement
      const updatedAnnouncement = await updateAnnouncement(
        currentAnnouncementId,
        payload,
        loggedinUser.token
      );

      if (updatedAnnouncement) {
        // Update the announcement in the state
        setAnnouncements(
          announcements.map((ann) =>
            ann._id === currentAnnouncementId ? updatedAnnouncement : ann
          )
        );
        resetForm();
      }
    } else {
      // Create new announcement
      const newAnnouncement = await createAnnouncement(
        courseId,
        payload,
        loggedinUser.token
      );

      if (newAnnouncement) {
        // Add the new announcement to the top of the list
        setAnnouncements([newAnnouncement, ...announcements]);
        resetForm();
      }
    }
  };

  // Handler to edit an announcement
  const handleEditAnnouncement = (announcement) => {
    setTitle(announcement.title);
    setMessage(announcement.message);
    setCurrentAnnouncementId(announcement._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handler to delete an announcement
  const handleDeleteAnnouncement = async () => {
    if (currentAnnouncementId) {
      const result = await deleteAnnouncement(
        courseId,
        currentAnnouncementId,
        loggedinUser.token
      );

      if (result) {
        // Remove the deleted announcement from state
        setAnnouncements(
          announcements.filter((ann) => ann._id !== currentAnnouncementId)
        );
        setShowDeleteConfirm(false);
        setCurrentAnnouncementId(null);
      }
    }
  };

  // Reset form and modal state
  const resetForm = () => {
    setTitle("");
    setMessage("");
    setShowModal(false);
    setIsEditing(false);
    setCurrentAnnouncementId(null);
  };

  // Open delete confirmation modal
  const confirmDelete = (announcementId) => {
    setCurrentAnnouncementId(announcementId);
    setShowDeleteConfirm(true);
  };

  const isInstructor = loggedinUser && loggedinUser.user.role === "instructor";

  return (
    <div className="p-3 sm:p-6 bg-orange-50 rounded-lg shadow-md w-full max-w-full min-w-0 min-h-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 break-words min-w-0 pr-1 leading-tight">
          Announcements
        </h2>
        {isInstructor && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-3 sm:px-4 rounded-md transition duration-300 ease-in-out inline-flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto text-sm sm:text-base"
          >
            <FaPlus className="shrink-0" />
            <span className="whitespace-nowrap">New announcement</span>
          </button>
        )}
      </div>

      {/* Empty state */}
      {announcements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-orange-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-orange-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <p className="text-gray-600">No announcements yet</p>
        </div>
      )}

      {/* Display all announcements */}
      <ul className="space-y-4">
        {announcements.map((ann) => (
          <li
            key={ann._id}
            className="bg-white border-l-4 border-orange-500 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500 break-words min-w-0 flex-1">
                {ann.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
                {isInstructor && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditAnnouncement(ann)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      aria-label="Edit announcement"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(ann._id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      aria-label="Delete announcement"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-700 mt-2 mb-3 break-words">{ann.message}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <FaRegClock className="mr-2" />
              {new Date(ann.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for creating/editing announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-orange-500">
                {isEditing ? "Edit Announcement" : "Create Announcement"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md py-2 px-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your announcement details here..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  {isEditing ? "Update Announcement" : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90dvh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAnnouncement}
                className="bg-red-500 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
