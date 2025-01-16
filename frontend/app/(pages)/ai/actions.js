'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// Helper function to make TMDB API calls


export async function getMovieRecommendations(userInput) {
  if (!userInput) {
    throw new Error('No input provided for movie recommendations')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `As a film expert, analyze this user input: "${userInput}"
    This could be about mood, genre, specific movie elements, or any film preferences.
    Recommend 5 movies that match the request with its imdb rating and exact tmdb Id .
    Consider:
    - Genre preferences
    - Mood or emotional tone
    - Specific themes or elements mentioned
    - Similar movies if referenced

    Format response as JSON array with objects containing:
    {
      "recommendations": [
        {
          "title": "Movie Title",
          "year": "YYYY",
          "tmdbId": "TMDB Movie ID",
          "ImdbRating":"Movies Imdb rating",
          "Director":"Director name
          "overview":"movie overview"

        }
      ]
    }

    Keep reasons concise but insightful.`

    const result = await model.generateContent(prompt)
    const response = result.response
    let parsedResponse

    try {
      parsedResponse = JSON.parse(response.text())
    } catch (error) {
      const text = response.text()
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0])
        } catch (innerError) {
          throw new Error('Could not parse AI response into valid JSON')
        }
      } else {
        throw new Error('AI response did not contain valid JSON')
      }
    }

    if (!parsedResponse?.recommendations || !Array.isArray(parsedResponse.recommendations)) {
      throw new Error('Invalid response format: missing recommendations array')
    }

    // Prepare results with only name, title, year, and tmdbId
    const tmdbResults = parsedResponse.recommendations.map((movie) => ({
      title: movie.title,
      year: movie.year,
      tmdbId: movie.tmdbId,
      ImdbRating:movie.ImdbRating,
      Director:movie.Director,
      overview:movie.overview
    }))

    return { success: true, data: tmdbResults }
  } catch (error) {
    console.error('Error in getMovieRecommendations:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get movie recommendations',
    }
  }
}
