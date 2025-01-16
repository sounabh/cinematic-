'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from "@/app/_components/ui/card"
import { HeartIcon, Loader2 } from 'lucide-react'
import Image from "next/image"
import useUserStore from '@/lib/userStore'

const MovieCollection = () => {
  const [watchedMovies, setWatchedMovies] = useState([])
  const [likedMovies, setLikedMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { token } = useUserStore()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })

        console.log(response);
        

        setWatchedMovies(response.data.watchedMovies || [])
        setLikedMovies(response.data.likedMovies || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch movies')
        console.error('Error fetching movies:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const fetchedLikedMovies = watchedMovies.filter((movie) => likedMovies.includes(movie.tmdbId))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1625] to-black text-white py-8 px-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl font-medium">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Loading your collection...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1625] to-black text-white py-8 px-4 flex items-center justify-center">
        <div className="text-xl text-red-400 bg-red-500/10 px-6 py-4 rounded-lg border border-red-500/20">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1625] to-black text-white py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('/film-grain.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
            Movie Collection
          </h1>
          <p className="text-purple-300/60 text-lg">Your personal cinema journey</p>
        </header>

        {/* Watched Movies Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-300 border-b border-purple-800/30 pb-3 flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Recently Watched
            </span>
            <span className="text-sm font-normal text-purple-400/60 mt-2">
              {watchedMovies.length} films
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchedMovies.map((movie, ind) => (
              <Card 
                key={movie.id || `watched-fallback-${ind}`}
                className="bg-[#2a2435]/80 backdrop-blur-sm border-purple-800/20 hover:border-purple-600/40 transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-2xl">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg?height=300&width=200"}
                      alt={movie.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium line-clamp-1 text-gray-100 group-hover:text-purple-300 transition-colors duration-300">
                      {movie.title}
                    </h3>
                    <span className="text-xs text-gray-400">{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Liked Movies Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-pink-300 border-b border-pink-800/30 pb-3 flex items-center gap-3">
            <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
              Favorites
            </span>
            <span className="text-sm font-normal text-pink-400/60 mt-2">
              {fetchedLikedMovies.length} films
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {fetchedLikedMovies.map((movie, ind) => (
              <Card 
                key={movie.id || `liked-fallback-${ind}`}
                className="bg-[#2a2435]/80 backdrop-blur-sm border-pink-800/20 hover:border-pink-600/40 transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-3">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-2xl">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg?height=300&width=200"}
                      alt={movie.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full">
                      <HeartIcon className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium line-clamp-1 text-gray-100 group-hover:text-pink-300 transition-colors duration-300">
                      {movie.title}
                    </h3>
                    <span className="text-xs text-gray-400">{movie.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MovieCollection

