'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Film, Star, User, Calendar } from 'lucide-react'
import { getMovieRecommendations } from './actions'

export default function Home() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null)
  
    const handleSubmit = async (e) => {
        console.log(query);
        
      e.preventDefault()
      setLoading(true)
      setError(null)
  
      try {
        const response = await getMovieRecommendations(query)
        if (response.success) {
            console.log(response.data);
            
          setResults(response.data)
        } else {
          setError(response.error)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
  

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900">
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-200 bg-clip-text text-transparent">
              Cinephile's Paradise
            </h1>
            <p className="text-purple-200 text-xl">
              Discover your next cinematic obsession
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your cinematic desires..."
              className="flex-1 bg-purple-950/50 border-purple-400/30 text-purple-100 placeholder:text-purple-400/60"
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-400 text-white px-8"
            >
              {loading ? 'Searching...' : 'Discover'}
            </Button>
          </form>

          {/* Results Grid */}
          <div className="grid gap-8">
            {results?.map((movie, index) => (
              <Card key={index} className="bg-purple-950/40 border-purple-400/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <div className="p-6">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-purple-100 mb-2">
                          {movie.title}
                        </CardTitle>
                        <CardDescription className="text-purple-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {movie.year}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-purple-100">{movie.ImdbRating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0 space-y-4">
                    <p className="text-purple-200 leading-relaxed">
                      {movie.overview}
                    </p>
                    
                    <div className="flex items-center gap-2 text-purple-300">
                      <User className="w-4 h-4" />
                      <span>Director: {movie.Director}</span>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href={`/films?q=${encodeURIComponent(movie.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Film className="w-4 h-4" />
                        View 
                      </a>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}