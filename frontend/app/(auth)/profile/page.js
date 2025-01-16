"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Camera, Heart, Film, Save, Pencil, Users, Star, Settings2, Clapperboard, Eye, Calendar } from 'lucide-react'
import axios from "axios"
import useUserStore from "@/lib/userStore"
import { motion } from "framer-motion"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Skeleton } from "@/app/_components/ui/skeleton"
import { Badge } from "@/app/_components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip"

export default function MainUserProfilePage() {
  const { token } = useUserStore()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    bio: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [toggleBio, setToggleBio] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const getProfile = async () => {

      setLoading(true)
      setError("")

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/profile`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        console.log(response);

        
        //const data = response.data.userInfo
          if (response.data.userInfo) {
          const fetchedUser = response.data.userInfo;
          setUserInfo(fetchedUser);
  
          // Set preview directly from the fetched data
          if (fetchedUser.userImage) {
            setPreview(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${fetchedUser.userImage}`);
          }
        }
        //console.log(userInfo);
        
       
       // console.log(preview);
        
       
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to fetch profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    getProfile()
  }, [token])

//console.log(userInfo);


  
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0]
    setImageFile(file)
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const data = new FormData()
      if (formData.username) data.append("username", formData.username)
      if (formData.password) data.append("password", formData.password)
      if (formData.bio) data.append("bio", formData.bio)
      if (imageFile) data.append("imageFile", imageFile)

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/profile`, data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })


      if (response.data.user) {
        const fetchedUser = response.data.user;
        setUserInfo(fetchedUser);

        // Set preview directly from the fetched data
        if (fetchedUser.userImage) {
          setPreview(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${fetchedUser.userImage}`);
        }
      }
      
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
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
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg mb-4" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-950 flex justify-center items-center p-4">
        <Card className="backdrop-blur-xl bg-red-950/50 border-red-500/20 max-w-md w-full">
          <CardContent className="p-6">
            <p className="text-red-400 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="flex flex-col gap-6">



        <div className="md:col-span-1">
          <Card className="backdrop-blur-xl bg-black/40 border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Profile Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 ring-4 ring-purple-500/20">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-900/30 flex items-center justify-center">
                          <Camera className="w-10 h-10 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </motion.div>

                {/* Username */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    {userInfo?.username || "Username"}
                  </h2>
                  <p className="text-purple-400/80 text-sm mt-1">Film Enthusiast</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3  gap-4 w-full">
                  <TooltipProvider>
                    {[
                      { icon: Users, label: "Following", value: userInfo?.following?.length || 0 },
                      { icon: Heart, label: "Followers", value: userInfo?.followers?.length || 0 },
                      { icon: Star, label: "Reviews", value: userInfo?.reviews?.length || 0 },
                    ].map(({ icon: Icon, label, value }) => (
                      <Tooltip key={label}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-purple-900/20 flex flex-col justify-center items-center p-4 rounded-lg backdrop-blur-sm border border-purple-500/10"
                          >
                            <Icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                            <div className="text-xl font-bold text-white">{value}</div>
                            <div className="text-xs text-purple-300">{label}</div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your {label.toLowerCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>

                {/* Bio */}
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-purple-300">Bio</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setToggleBio(!toggleBio)}
                      className="text-purple-400 hover:text-black"
                    >
                      {toggleBio ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    </Button>
                  </div>
                  {!toggleBio ? (
                    <p className="text-white/90 p-3 rounded-lg bg-purple-900/20 border border-purple-500/10">
                      {userInfo?.bio || "Add your bio..."}
                    </p>
                  ) : (
                    <Textarea
                      name="bio"
                      placeholder="Write your bio here..."
                      className="bg-purple-900/20 border-purple-500/30 text-purple-200 focus:ring-purple-500"
                      onChange={handleInputChange}
                      value={formData.bio}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
 {/* Profile Settings */}
          <Card className="backdrop-blur-xl bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-purple-300">
                <Settings2 className="w-5 h-5 text-purple-300" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-300">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="bg-purple-900/20 border-purple-500/30 text-purple-200 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-300">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="bg-purple-900/20 border-purple-500/30 text-purple-200 focus:ring-purple-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>


        </div>
        



        {/* Content Cards */}
        <div className="md:col-span-2">
  <Card className="backdrop-blur-xl bg-black/40 border-purple-500/20 text-purple-400">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
        <Film className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
        Recent Watches
      </CardTitle>
    </CardHeader>
    <CardContent>
      {userInfo?.watchedMovies?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {userInfo.watchedMovies.slice(-10).reverse().map((movie, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group bg-purple-900/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex gap-2 sm:gap-4">
                    {/* Movie Poster */}
                    <div className="relative w-20 h-28 sm:w-24 md:w-32 sm:h-36 md:h-48 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={movie.posterUrl || '/placeholder-movie.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Movie Details */}
                    <div className="flex flex-col flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 line-clamp-2">
                        {movie.title}
                      </h4>
                      
                      <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
                        {movie.releaseDate && (
                          <div className="flex items-center text-xs sm:text-sm text-purple-300">
                            <Calendar className="w-3 h-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                            {new Date(movie.releaseDate).getFullYear()}
                          </div>
                        )}
                        
                        {movie.rating && (
                          <div className="flex items-center text-xs sm:text-sm text-purple-300">
                            <Star className="w-3 h-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                            {movie.rating}/10
                          </div>
                        )}
                        
                        <Badge
                          variant="secondary"
                          className={`w-fit text-xs sm:text-sm px-2 py-0.5 hover:bg-purple-900 ${
                            userInfo?.likedMovies?.includes(movie.tmdbId)
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-purple-900/50 text-purple-300"
                          }`}
                        >
                          <Heart
                            className={`w-3 h-3 mr-1 flex-shrink-0 ${
                              userInfo?.likedMovies?.includes(movie.tmdbId) ? "fill-pink-700" : ""
                            }`}
                          />
                          {userInfo?.likedMovies?.includes(movie.tmdbId) ? "Liked" : "Like"}
                        </Badge>

                        {movie.watchedDate && (
                          <div className="flex items-center text-xs text-purple-300/70 mt-1 sm:mt-2">
                            <Eye className="w-3 h-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="truncate">
                              Watched {new Date(movie.watchedDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-purple-300 text-base sm:text-lg">No movies watched yet</p>
        </div>
      )}
    </CardContent>
  </Card>
</div>
          
        </div>
      </div>
   
  )
}
