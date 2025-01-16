// app/actions/getMovieRecommendations.js
'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { headers } from 'next/headers'

const genAI = new GoogleGenerativeAI("AIzaSyAjYYE040tV3bXaLBjfrderSo42NBCDavI")

const TMDB_API_KEY = "f40306d5eba816303672d915dd2a0a94" // Make sure this is in .env, not NEXT_PUBLIC

const text = ""

export async function getMovieRecommendations(text) {
  if (!text) {
    throw new Error('No text provided for movie recommendations')
  }
console.log(text);

  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Create the prompt
    const prompt = `As a film expert, analyze this user input: "give some best sicifi movies"
    This could be about mood, genre, specific movie elements, or any film preferences.
    Recommend 5 movies that match the request.
    Consider:
    - Genre preferences
    - Mood or emotional tone
    - Specific themes or elements mentioned
    - Similar movies if referenced
    
    Format response as JSON array with objects containing:
    {
      "title": "Movie Title",
      "year": "Year",
      "reason": "Brief explanation of why this movie matches the request"
    }
    
    Keep reasons concise but insightful.`

    // Get AI recommendations
    const result = await model.generateContent(prompt)
    console.log(result);
    
    const response =  result.response
    let recommendations
    
    try {
      recommendations = JSON.parse(response.text())
    } catch (error) {
      console.error('Failed to parse AI response:', response.text())
      throw new Error('Invalid AI response format')
    }

    if (!Array.isArray(recommendations)) {
      throw new Error('Invalid recommendations format')
    }

    // Fetch TMDB details
    const tmdbResults = await Promise.all(
      recommendations.map(async (movie) => {
        try {
          // Search for movie
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}`,
            { cache: 'no-store' }
          )

          if (!searchRes.ok) {
            throw new Error(`TMDB search failed: ${searchRes.status}`)
          }

          const searchData = await searchRes.json()
          const tmdbMovie = searchData.results?.[0]

          if (!tmdbMovie) {
            return {
              ...movie,
              poster_path: null,
              tmdb_id: null,
              overview: "No additional details available",
              cast: []
            }
          }

          // Fetch cast information
          const creditsRes = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/credits?api_key=${TMDB_API_KEY}`,
            { cache: 'no-store' }
          )

          if (!creditsRes.ok) {
            throw new Error(`TMDB credits fetch failed: ${creditsRes.status}`)
          }

          const creditsData = await creditsRes.json()
          
          return {
            ...movie,
            poster_path: tmdbMovie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` 
              : null,
            tmdb_id: tmdbMovie.id,
            overview: tmdbMovie.overview,
            cast: creditsData.cast
              ?.slice(0, 5)
              .map((actor) => ({
                name: actor.name,
                character: actor.character,
                profile_path: actor.profile_path 
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                  : null
              })) || []
          }
        } catch (error) {
          console.error(`Error fetching details for ${movie.title}:`, error)
          return {
            ...movie,
            poster_path: null,
            tmdb_id: null,
            overview: "Failed to fetch additional details",
            cast: []
          }
        }
      })
    )

    return { success: true, data: tmdbResults }
  } catch (error) {
    console.error('Error in getMovieRecommendations:', error)
    return {
      success: false,
      error: error.message || 'Failed to get movie recommendations'
    }
  }
}