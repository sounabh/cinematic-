"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios"; // Importing Axios for API requests
import { Star, Calendar, Heart, Eye, List, Clock } from "lucide-react"; // Importing icons from Lucide
import { fetchSearchMovies } from "@/lib/globalApi"; // Custom API function to fetch movies

export const dynamic = "force-dynamic";

const ResultsPage = () => {
  const router = useRouter(); // Router for navigation

  // State to store the list of movies and the loading state
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Extract search query (e.g., 'avengers') from URL

  useEffect(() => {
    if (!query) return; // Exit early if there's no search query

    const fetchMovies = async () => {
      try {
        const response = await fetchSearchMovies(query); // Fetch movie data
        setMovies(response); // Set movie data
      } catch (err) {
        console.error("Failed to fetch:", err);
        setMovies([]); // Reset movies on error
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    };

    fetchMovies(); // Trigger movie fetch
  }, [query]); // Re-run effect when query changes

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-500"; // High rating (Green)
    if (rating >= 6) return "text-yellow-500"; // Medium rating (Yellow)
    return "text-red-500"; // Low rating (Red)
  };

  const handleMovieClick = (movieId) => {
    router.push(`/films/${movieId}`); // Navigate to movie details
  };

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-purple-400/90">
          Results for: {query}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative group cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#2c3440]">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/40">No Poster</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/90 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                <div>
                  <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={`${getRatingColor(movie.vote_average)} w-5 h-5`} />
                    <span className="text-sm">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-white/70 line-clamp-3 mb-2">
                    {movie.overview}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {movie.release_date && new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <List className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        )}

        {!isLoading && movies.length === 0 && (
          <p className="text-center text-white/60 mt-8">No movies found.</p>
        )}
      </div>
    </div>
  );
};

// Wrap your ResultsPage component inside Suspense in the parent component
const SuspendedResultsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResultsPage />
  </Suspense>
);

export default SuspendedResultsPage;
