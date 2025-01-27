"use client"

import React, { useEffect, useState } from "react"
import { MessageCircle, Heart, Users, Film, Clock, Star, Calendar, Eye } from 'lucide-react'
import { motion } from "framer-motion"
import axios from "axios"
import { useParams } from "next/navigation"
import Link from "next/link"
import useUserStore from "@/lib/userStore"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Skeleton } from "@/app/_components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip"

// MovieCard component defined outside main component to avoid re-creation
const MovieCard = ({ movie, userInfo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full"
  >
    <Card className="group bg-purple-900/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
      <CardContent className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Movie Poster */}
          <div className="relative w-full sm:w-32 h-48 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={movie.posterUrl || '/placeholder-movie.jpg'}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Movie Details */}
          <div className="flex flex-col flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2">
              {movie.title}
            </h4>
            
            <div className="flex flex-col gap-2 mt-auto">
              {movie.releaseDate && (
                <div className="flex items-center text-xs sm:text-sm text-purple-300">
                  <Calendar className="w-3 h-3 mr-2" />
                  {new Date(movie.releaseDate).getFullYear()}
                </div>
              )}
              
              {movie.rating && (
                <div className="flex items-center text-xs sm:text-sm text-purple-300">
                  <Star className="w-3 h-3 mr-2" />
                  {movie.rating}/10
                </div>
              )}
              
              <Badge
                variant="secondary"
                className={`w-fit text-xs hover:bg-purple-900 ${
                  userInfo?.likedMovies?.includes(movie.tmdbId)
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-purple-900/50 text-purple-300"
                }`}
              >
                <Heart
                  className={`w-3 h-3 mr-1 ${
                    userInfo?.likedMovies?.includes(movie.tmdbId) ? "fill-pink-700" : ""
                  }`}
                />
                {userInfo?.likedMovies?.includes(movie.tmdbId) ? "Liked" : "Like"}
              </Badge>

              {movie.watchedDate && (
                <div className="flex items-center text-xs text-purple-300/70 mt-2">
                  <Eye className="w-3 h-3 mr-2" />
                  Watched {new Date(movie.watchedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ResponsiveProfile component defined outside main component
const ResponsiveProfile = ({ userInfo, chatId, handleFollow, toggleFollow }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-950 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="backdrop-blur-xl bg-black/40 border-purple-500/20">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Avatar className="w-24 sm:w-32 h-24 sm:h-32 border-4 border-purple-500/50 ring-4 ring-purple-500/20">
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${userInfo?.userImage}`} />
                    <AvatarFallback className="text-2xl sm:text-4xl bg-purple-900/50">
                      {userInfo?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mt-4 sm:mt-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    {userInfo?.username}
                  </h2>
                  <p className="text-sm sm:text-base text-purple-300/80 mt-2 px-4">
                    {userInfo?.bio || "No bio yet"}
                  </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full my-4 sm:my-8">
                  <TooltipProvider>
                    {[
                      { icon: Users, label: "Following", value: userInfo?.following?.length || 0 },
                      { icon: Heart, label: "Followers", value: userInfo?.followers?.length || 0 },
                      { icon: Film, label: "Reviews", value: userInfo?.reviews?.length || 0 },
                    ].map(({ icon: Icon, label, value }) => (
                      <Tooltip key={label}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-purple-900/20 p-2 sm:p-4 rounded-lg backdrop-blur-sm border flex items-center flex-col border-purple-500/10"
                          >
                            <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400 mx-auto mb-1 sm:mb-2" />
                            <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
                            <div className="text-xs text-purple-300">{label}</div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>`User&apos;s`{label.toLowerCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-4 w-full">
                  <Button
                    variant="default"
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-sm sm:text-base"
                    asChild
                  >
                    <Link href={`/message/${chatId}`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                  <Button
                    variant={toggleFollow ? "secondary" : "default"}
                    className={`flex-1 text-sm sm:text-base ${
                      toggleFollow ? "bg-gray-800 text-white" : "bg-purple-600 text-white hover:bg-purple-500"
                    }`}
                    onClick={handleFollow}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {toggleFollow ? "Following" : "Follow"}
                  </Button>
                </div>

                {/* Additional Stats */}
                <div className="w-full mt-4 sm:mt-8 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between text-purple-300 text-sm sm:text-base">
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Liked Movies
                    </span>
                    <Badge variant="secondary" className="bg-transparent hover:bg-purple-700 text-purple-300">
                      {userInfo?.likedMovies?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-purple-300 text-sm sm:text-base">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Member Since
                    </span>
                    <Badge variant="secondary" className="bg-transparent hover:bg-purple-700 text-purple-300">
                      {new Date(userInfo?.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movies Section */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-xl bg-black/40 border-purple-500/20 text-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Film className="w-5 h-5 text-purple-400" />
                Recent Watches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo?.watchedMovies?.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {userInfo.watchedMovies.slice(-10).reverse().map((movie, idx) => (
                    <MovieCard key={idx} movie={movie} userInfo={userInfo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Eye className="w-8 sm:w-12 h-8 sm:h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg text-purple-300">No movies watched yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function OtherUserProfilePage() {
  const { token } = useUserStore()
  const { user } = useUserStore()
  const params = useParams()

  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggleFollow, setToggleFollow] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/profile/${params.id}`, {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        console.log(response);
        
        setUserInfo(response.data.data)
        if (response.data.data.followers.includes(user._id)) {
          setToggleFollow(true)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [params.id, token, user._id])

  const chatArr = [user._id, userInfo?._id].sort()
  const chatId = `${chatArr[0]}_${chatArr[1]}`

  const handleFollow = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/profile/${params.id}/follow`, {}, {
        headers: { authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      setToggleFollow(!toggleFollow)
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-950 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="backdrop-blur-xl bg-black/40">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <Skeleton className="w-32 h-32 rounded-full" />
                  <Skeleton className="h-8 w-48" />
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-lg" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="backdrop-blur-xl bg-black/40">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[280px] rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveProfile
      userInfo={userInfo}
      chatId={chatId}
      handleFollow={handleFollow}
      toggleFollow={toggleFollow}
    />
  )
}