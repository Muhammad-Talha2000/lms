import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

const SearchInput = ({ isHeader = false, className = "", onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(!isHeader); // Expanded by default if not in header

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery); // Call onSearch with the query
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex items-center ${className} ${
        isHeader
          ? " rounded-full  focus:outline-none transition-all duration-2000 ease-in-out  "
          : ""
      }`}
    >
      {isHeader && !isExpanded ? (
        <button
          type="button" 
          onClick={() => setIsExpanded(true)}
          className="flex items-center"
        >
          <CiSearch
            className="h-8  w-12 size-2 text-gray-100"
            aria-hidden="true"
          />
        </button>
      ) : (
        <>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${
              isHeader
                ? "pr-10 h-10 px-8 pr-1 rounded-full  outline-none"
                : "pr-10"
            }`}
            onBlur={() => isHeader && setIsExpanded(false)}
            
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <CiSearch className="h-8  w-12 text-gray-100" aria-hidden="true" />
          </button>
        </>
      )}
    </form>
  );
};

export default SearchInput;
