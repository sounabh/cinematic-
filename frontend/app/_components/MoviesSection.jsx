"use client";

import React, { useEffect, useState } from 'react';
import { fetchTrendingMovies, test } from "@/lib/globalApi.js";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MoviesSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieData = await fetchTrendingMovies();
        setMovies(movieData);
        setError(null);
      } catch (err) {
        setError('Unable to load movies at this time. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  const handleClick = (id) => {
    router.push(`/films/${id}`);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 lg:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center">Popular this week</h2>
          </div>
          <button className="border-purple-500 text-purple-400 hover:bg-purple-500/10 py-2 px-4 border rounded-md text-sm sm:text-base w-full sm:w-auto">
            View all
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          // Movies Grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {movies.slice(0, 15).map((movie) => (
              <div
                onClick={() => handleClick(movie.id)}
                key={movie.id}
                className="bg-black/40 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 cursor-pointer"
              >
                {/* Movie Poster */}
                <div className="p-0 aspect-[2/3] relative group">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* Overlay with Movie Details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 sm:p-4 flex flex-col justify-end">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold line-clamp-2">{movie.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {movie.release_date.split("-")[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MoviesSection;