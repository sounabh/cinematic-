"use client";

import useUserStore from "@/lib/userStore";
import AppFeatures from "./_components/AppFeatures";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import Journal from "./_components/Journal";
import MoviesSection from "./_components/MoviesSection";
import Navbar from "./_components/Navbar";
import MovieSearch from "./_components/searchBox";
import axios from "axios";
import { useEffect } from "react";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
  withCredentials: true
});

// Add interceptor to handle token expiration globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear user state
      useUserStore.getState().clearUser();
    }
    return Promise.reject(error);
  }
);

export default function MovieLanding() {
  const { token, clearUser } = useUserStore();

  useEffect(() => {
    // Only check token if it exists
    if (!token) return;

    const validateToken = async () => {
      try {
        await api.post("/checktoken", {}, {
          headers: { authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // Token validation failed - clear user
        console.error("Token validation failed:", error.message);
        clearUser();
      }
    };

    validateToken();
  }, [token, clearUser]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-lg mx-auto">
        <Navbar />
        <Hero />
        <MovieSearch />
        <Features />
        <MoviesSection />
        <AppFeatures />
        <Journal />
        <Footer />
      </div>
    </div>
  );
}