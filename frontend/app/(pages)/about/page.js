'use client'

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Badge } from "@/app/_components/ui/badge"
import { Film, Star, Users, Play, Clock, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        
        {/* Motion Animation for Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            CineVerse
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Where every frame tells a story, and every review sparks a conversation.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[  // Stats Cards
            { icon: Film, number: "100K+", label: "Films Reviewed" },
            { icon: Users, number: "50K+", label: "Active Critics" },
            { icon: Star, number: "1M+", label: "Ratings Given" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-purple-900/20 border-purple-500/20">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <stat.icon className="w-8 h-8 mb-4 text-purple-400" />
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-purple-900/20 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">Our Mission</Badge>
            <h2 className="text-4xl font-bold mb-8">Elevating Cinema Through Community</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At CineVerse, we believe in the transformative power of cinema. Our platform isn't just 
              about watching movies—it's about experiencing them, discussing them, and understanding 
              the intricate artistry behind every frame.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We're building a community where cinephiles can connect, share their perspectives, 
              and discover films that challenge, inspire, and move them.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[  // Feature Cards
            {
              icon: Play,
              title: "Curated Collections",
              description: "Discover carefully curated film collections that span genres, decades, and movements."
            },
            {
              icon: Clock,
              title: "Watchlist Evolution",
              description: "Track your cinematic journey with advanced watchlist features and progress insights."
            },
            {
              icon: Heart,
              title: "Personal Rankings",
              description: "Create and share your personal film rankings and yearly favorites."
            },
            {
              icon: Users,
              title: "Community Discussions",
              description: "Engage in meaningful discussions about films with fellow cinephiles."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-purple-900/20 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">Our Team</Badge>
            <h2 className="text-4xl font-bold">The Faces Behind CineVerse</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[  // Team Members
              {
                name: "Alexandra Chen",
                role: "Chief Curator",
                avatar: "/placeholder.svg?height=100&width=100"
              },
              {
                name: "Marcus Rivera",
                role: "Head of Community",
                avatar: "/placeholder.svg?height=100&width=100"
              },
              {
                name: "Sarah Kim",
                role: "Content Director",
                avatar: "/placeholder.svg?height=100&width=100"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-purple-500">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-purple-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-24 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Join Our Community of Film Lovers
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Start your cinematic journey today. Share your thoughts, discover new favorites, 
          and connect with fellow film enthusiasts.
        </p>
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </motion.div>
    </div>
  )
}
