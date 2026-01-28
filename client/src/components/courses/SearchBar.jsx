// import React from "react";
// import { FiSearch } from "react-icons/fi"; // Import search icon from react-icons

// const SearchBar = (searchQuery, onSearchChange) => {
//   return (
//     <div className="flex items-center bg-gray-100 my-12 align-center rounded-full px-4 py-2 w-full max-w-lg">
//       {/* Input field */}
//       <input
//         type="text"
//         placeholder="Search course here..."
//         className="bg-gray-100 outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
//         value={searchQuery}
//         onChange={(e) => onSearchChange(e.target.value)} // Handle input change
//       />
//       {/* Search button */}
//       <button className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all">
//         <FiSearch className="mr-2" /> Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;

import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center bg-gray-100 my-12 align-center rounded-full px-4 py-2 w-full max-w-lg">
      <input
        type="text"
        placeholder="Search course here..."
        className="bg-gray-100 outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)} // Handle input change
      />
      <button className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all">
        <FiSearch className="mr-2" /> Search
      </button>
    </div>
  );
};

export default SearchBar;
