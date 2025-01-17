"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, Calendar, Clock, Heart, Eye, Plus } from "lucide-react";
import ReviewBox from "@/app/_components/ReviewBox";
import MovieReviews from "@/app/_components/ReviewSection";
import {
  toggleLike,
  toggleWatched,
  postReview,
  deleteReview,
  fetchMovieReviews,
} from "@/lib/actions/apiCalls.js";
import { fetchSearchMovieDeatils } from "@/lib/globalApi";
import useUserStore from "@/lib/userStore";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);  // Initialize as empty array
  const [isLiked, setIsLiked] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  
  const token = useUserStore((state) => state.token);
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch movie details first
        const movieData = await fetchSearchMovieDeatils(params.id);
        setMovie(movieData);

        const movieReviews = await fetchMovieReviews(params.id);
        // Ensure reviews is always an array
        setReviews(Array.isArray(movieReviews) ? movieReviews : []);

        // If we have a token, fetch auth-required data
        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/films/${params.id}/interactions`,
            {
              headers: { authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          
          setIsLiked(response.data.isLiked);
          setIsWatched(response.data.isWatched);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          description: "Error loading movie details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, token, toast]);

  const handleReviewSubmit = async (rating, reviewText) => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Please login to submit a review.",
      });
      return;
    }

    if (!rating || !reviewText?.trim()) {
      toast({
        variant: "destructive",
        description: "Please provide both a rating and review.",
      });
      return;
    }

    try {
      const response = await postReview(
        params.id,
        {
          rating: Number(rating),
          review: reviewText.trim(),
          movieId: params.id,
        },
        token
      );

      const newReview = response?.result || response;
      const formattedReview = {
        id: newReview._id || newReview.id || Date.now().toString(),
        rating: Number(newReview.rating),
        review: newReview.review.trim(),
        movieId: params.id,
        createdAt: newReview.createdAt || new Date().toISOString(),
        user: newReview.user || { id: "current-user" },
      };

      // Safely update reviews array
      setReviews((prevReviews) => {
        const currentReviews = Array.isArray(prevReviews) ? prevReviews : [];
        return [...currentReviews, formattedReview];
      });

      toast({
        description: "Your review has been submitted.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        description: error.message || "Error submitting review. Please try again.",
      });
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Please login to like movies.",
      });
      return;
    }

    try {
      const movieData = {
        title: movie.title,
        description: movie.overview,
        releaseDate: movie.release_date,
        genre: movie.genres.map((g) => g.name),
        duration: movie.runtime,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        tmdbId: params.id,
      };

      const response = await toggleLike(params.id, movieData, token);
      setIsLiked(response);
    } catch (error) {
      console.error("Error updating like status:", error);
      toast({
        variant: "destructive",
        description: error.message || "Error updating like status. Please try again.",
      });
    }
  };

  const handleWatched = async () => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Please login to mark movies as watched.",
      });
      return;
    }

    try {
      const movieData = {
        title: movie.title,
        description: movie.overview,
        releaseDate: movie.release_date,
        genre: movie.genres.map((g) => g.name),
        duration: movie.runtime,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        tmdbId: params.id,
      };

      const response = await toggleWatched(params.id, movieData, token);
      setIsWatched(response);
    } catch (error) {
      console.error("Error updating watched status:", error);
      toast({
        variant: "destructive",
        description: error.message || "Error updating watched status. Please try again.",
      });
    }
  };

  // Rest of the component remains the same...
  // (Keeping the JSX part unchanged since the error was in the state management logic)
  // Rest of your component JSX remains the same...

  if (isLoading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="min-h-screen bg-black text-white pb-12 sm:pb-20">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] sm:h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${backdropUrl})`,
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-32 h-48 sm:w-48 sm:h-72 rounded-md shadow-lg mx-auto sm:mx-0"
          />

          <div className="flex flex-col justify-end text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-gray-300 mb-4 text-sm sm:text-base">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.runtime}m
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="flex justify-center sm:justify-start gap-3 sm:gap-4">
              <button
                onClick={handleWatched}
                className={`${
                  isWatched ? "bg-green-600" : "bg-white/10"
                } hover:bg-green-700 px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm sm:text-base`}
              >
                <Eye className={`w-4 h-4 ${isWatched ? "fill-current" : ""}`} />
                {isWatched ? "Watched" : "Mark Watched"}
              </button>

              <button
                onClick={handleLike}
                className={`${
                  isLiked ? "bg-pink-600" : "bg-white/10"
                } hover:bg-pink-700 px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm sm:text-base`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">{movie.overview}</p>

            {/* Cast */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {movie.credits?.cast?.slice(0, 8).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-2">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm sm:text-base">{person.name}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{person.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold mb-2">Details</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-400">Director</dt>
                  <dd>
                    {movie.credits?.crew?.find((p) => p.job === "Director")?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400">Studios</dt>
                  <dd className="break-words">
                    {movie.production_companies?.map((c) => c.name).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-400">Genres</dt>
                  <dd className="break-words">
                    {movie.genres?.map((g) => g.name).join(", ")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Review Box */}
            <ReviewBox onSubmit={handleReviewSubmit} />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <MovieReviews reviews={reviews} />
    </div>
  );
}