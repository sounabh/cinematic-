"use server";

import axios from "axios";

// Create an Axios instance with default configurations
// This instance will be used for making HTTP requests
const axiosInstance = axios.create({
  baseURL: "https://late-mud-6a18.bagsounabh2003.workers.dev", // This is the Cloudflare Worker URL that acts as a proxy
  headers: {
    "Content-Type": "application/json", // Set the default content type to JSON
  },
});





// Fetch trending movies
// This function retrieves the trending movies from TMDB API for the current week
const fetchTrendingMovies = async () => {
  try {
    // The target TMDB URL with the API key for the trending movies endpoint
    const targetUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;

    // Use the Axios instance to send a GET request to the proxy URL
    // The TMDB URL is passed as a parameter to the proxy
    const response = await axiosInstance.get("/", {
      params: {
        url: targetUrl, // Send the TMDB URL as a parameter to the proxy
      },
    });

    // Return the movie results from the response data
    return response.data.results;
  } catch (err) {
    // Catch any errors and throw a custom error message
    throw new Error("Unable to load movies at this time. Please try again later.");
  }
};

// Fetch search results for movies
// This function allows you to search for movies based on a query string
const fetchSearchMovies = async (query) => {
  try {
    // The target TMDB URL with the API key and the search query
    const targetUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}`;

    // Send the request through the Axios instance to the proxy
    // The TMDB URL with the search query is passed as a parameter
    const response = await axiosInstance.get("/", {
      params: {
        url: targetUrl, // Send the TMDB URL as a parameter to the proxy
      },
    });

    // Return the search results from the response data
    return response.data.results;
  } catch (err) {
    // Catch any errors and throw a custom error message
    throw new Error("Unable to load movies at this time. Please try again later.");
  }
};

// Fetch movie details
// This function fetches detailed information about a specific movie
const fetchSearchMovieDeatils = async (id) => {
  try {
    // The target TMDB URL with the movie ID, API key, and additional data (credits, similar movies, videos)
    const targetUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits,similar,videos`;

    // Use the Axios instance to send the GET request to the proxy
    // The TMDB URL with the movie ID is passed as a parameter
    const response = await axiosInstance.get("/", {
      params: {
        url: targetUrl, // Send the TMDB URL as a parameter to the proxy
      },
    });

    // Return the movie details from the response data
    return response.data;
  } catch (err) {
    // Catch any errors and throw a custom error message
    throw new Error("Unable to load movies at this time. Please try again later.");
  }
};

// Export the functions to be used elsewhere in the project
export { fetchTrendingMovies, fetchSearchMovies, fetchSearchMovieDeatils };
