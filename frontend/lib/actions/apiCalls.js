import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL; // Replace with your backend API URL


/**
 * Fetch all reviews for a specific movie.
 * Requires the movie's unique identifier.
 */
export const fetchMovieReviews = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/films/${id}`);
  return response.data.data;
};

/**
 * Check if the current user has liked a specific movie.
 * Requires the movie's unique identifier and user authentication token.
 */
/*export const fetchLikeStatus = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/films/${id}/like`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.isLiked;
};*/

/**
 * Toggle the like status of a movie for the current user.
 * Requires the movie's unique identifier, movie metadata, and user authentication token.
 */
export const toggleLike = async (id, movieData, token) => {
  const response = await axios.post(`${API_BASE_URL}/films/${id}/like`, movieData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.isLiked;
};

/**
 * Check if the current user has marked a movie as watched.
 * Requires the movie's unique identifier and user authentication token.
 */
/*export const fetchWatchedStatus = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/films/${id}/watch`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.isWatched;
};

/**
 * Toggle the watched status of a movie for the current user.
 * Requires the movie's unique identifier, movie metadata, and user authentication token.
 */


export const toggleWatched = async (id, movieData, token) => {
  const response = await axios.post(`${API_BASE_URL}/films/${id}/watch`, movieData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.isWatched;
};

/**
 * Fetch a list of movies liked by the current user.
 * Requires user authentication token.
 */
export const fetchLikedMovies = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/films/liked`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.movies;
};

/**
 * Fetch a list of movies marked as watched by the current user.
 * Requires user authentication token.
 */
export const fetchWatchedMovies = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/films/watch`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data.movies;
};

/**
 * Post a new review for a specific movie.
 * Requires the movie's unique identifier, review data, and user authentication token.
 */
export const postReview = async (id, reviewData, token) => {
  const response = await axios.post(`${API_BASE_URL}/films/${id}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Delete an existing review for a specific movie.
 * Requires the movie's unique identifier, review ID, and user authentication token.
 */
/*export const deleteReview = async (id, reviewId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/films/${id}/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};
*/