"use client";

import { useState } from "react";
import { Search, Users, Film, Heart, UserPlus } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/app/_components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/_components/ui/hover-card";
import { Badge } from "@/app/_components/ui/badge";
import axios from "axios";
import Link from "next/link";
import useUserStore from "@/lib/userStore";

export default function UserSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useUserStore();

  const handleSubmit = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/members/search`,
        { username: searchQuery },
        {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setSearchResults(response.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      console.log(`Following user: ${userId}`);
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-950">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Search Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 text-transparent bg-clip-text">
              Discover Film Enthusiasts
            </h1>
            <p className="text-purple-300 mb-8">
              Connect with movie lovers, share your thoughts, and explore cinema
              together
            </p>

            {/* Enhanced Search Box */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <Input
                    placeholder="Find cinephiles by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                    className="pl-12 py-6 text-lg bg-purple-950/50 border-purple-700/30 text-purple-50 placeholder:text-purple-400/70 backdrop-blur-xl"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 "
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-red-500/20 bg-red-950/10 backdrop-blur-xl">
              <CardContent className="p-4 text-red-400">{error}</CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        <div className="w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          {searchResults?.length > 0 && (
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 mb-4 sm:mb-8 text-purple-100">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              Found {searchResults?.length}{" "}
              {searchResults?.length === 1 ? "user" : "users"}
            </h2>
          )}

          {/* User Cards Grid */}
          <div className="grid gap-4 sm:gap-6">
            {searchResults?.map((user) => (
              <Card
                key={user._id}
                className="bg-purple-950/30 border-purple-700/20 backdrop-blur-xl hover:bg-purple-900/40 transition-all duration-300"
              >
                <Link href={`profile/${user._id}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                      {/* User Avatar with Hover Card */}
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-purple-500/50 ring-2 ring-purple-500/20 ring-offset-2 ring-offset-purple-950">
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${user.userImage}`}
                            />
                            <AvatarFallback className="bg-purple-600 text-sm sm:text-base">
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-[280px] sm:w-80 bg-purple-950/90 border-purple-700/30 backdrop-blur-xl">
                          <div className="flex justify-between space-x-4">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                              <AvatarImage
                                src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${user.userImage}`}
                              />
                              <AvatarFallback>
                                {user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-base sm:text-lg font-semibold text-purple-100">
                                @{user.username}
                              </h4>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-purple-900/50 text-xs"
                                >
                                  <Film className="w-3 h-3 mr-1" />
                                  {user.watchedMovies.length} films
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-purple-900/50 text-xs"
                                >
                                  <Heart className="w-3 h-3 mr-1" />
                                  {user.followers.length} followers
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                          <span className="group">
                            <h3 className="text-lg sm:text-xl font-semibold text-purple-100 group-hover:text-purple-400 transition-colors truncate">
                              @{user.username}
                            </h3>
                          </span>
                         
                        </div>

                        {user.bio && (
                          <p className="text-purple-300 mt-2 sm:mt-3 text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {user.bio}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 sm:gap-6 mt-3 sm:mt-4">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-400">
                            <Film className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {user.watchedMovies.length} films watched
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-400">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{user.followers.length} followers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <div>
          {/* No Results Message */}
          {searchResults?.length === 0 && searchQuery && !loading && (
            <Card className="bg-purple-950/30 border-purple-700/20 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <p className="text-purple-300 text-lg">
                  No users found matching "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
