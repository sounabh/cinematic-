import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { BookOpen, File, Heart, Star } from 'lucide-react'

const Features = () => {
  const featureData = [
    {
      icon: <Star className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-500 mb-3 sm:mb-4" />,
      title: "Rate & Review",
      description: "Rate, review and tag films as you add them to your diary.",
    },
    {
      icon: <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-500 mb-3 sm:mb-4" />,
      title: "Journal",
      description: "Keep a diary of your film watching experiences.",
    },
    {
      icon: <File className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-500 mb-3 sm:mb-4" />,
      title: "Watchlist",
      description: "Keep track of films you want to watch.",
    },
  ];

  return (
    <div>
      <section className="py-12 sm:py-16 md:py-24 bg-black/50">
        <div className="container px-4 mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <Badge className="bg-purple-500/10 text-purple-400 mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">
              Features
            </Badge>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">
              Everything you need to track your films
            </h2>
            
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Keep track of every film you've ever watched or want to watch. Rate, review and share your experience.
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {featureData.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <CardContent className="p-4 sm:p-5 md:p-6 text-center">
                  {feature.icon}
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;