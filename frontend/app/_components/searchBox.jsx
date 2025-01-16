"use client";

import React, { useState } from "react";
import { Search } from "lucide-react"; // Icon for the search input
import { useRouter } from "next/navigation"; // Router for navigation

const MovieSearch = () => {
  // State to hold the search query
  const [search, setSearch] = useState("");

  // State to manage the loading state during search
  const [isLoading, setIsLoading] = useState(false);

  // Router instance to handle navigation
  const router = useRouter();

  /**
   * Handles the form submission for searching movies.
   * Trims the search query, navigates to the results page, and manages loading state.
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    // Trim any extra spaces in the search query
    const trimmedSearch = search.trim();

    // Prevent submission if the input is empty
    if (!trimmedSearch) return;

    // Set loading state to true while navigating
    setIsLoading(true);

    try {
      // Navigate to the films page with the search query as a query parameter
      router.push(`/films?q=${encodeURIComponent(trimmedSearch)}`); ///films optional q=encodeuri to handle special characters like star wars it wont break hence star%20wars q is optionals hence it wont effect router 
    } catch (err) {
      // Log any navigation errors
      console.error("Navigation failed:", err);
    } finally {
      // Reset the loading state once navigation completes
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search query state
          placeholder="Search movies..."
          disabled={isLoading} // Disable input when loading
          className="w-full px-4 py-2 pl-10 rounded-lg border border-purple-300 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 
                     focus:border-transparent bg-white shadow-sm text-purple-700 
                     disabled:bg-gray-100"
        />

        {/* Search Icon */}
        <Search
          className="absolute left-3 top-2.5 text-purple-500"
          size={20} // Icon size
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className="absolute right-2 top-1.5 bg-purple-600 text-white px-3 py-1 
                     rounded-md hover:bg-purple-700 text-sm disabled:bg-purple-400"
        >
          {/* Show "Searching..." text when loading, else display "Search" */}
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
};

export default MovieSearch;
