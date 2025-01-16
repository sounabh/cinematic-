import { Badge, Calendar, Star } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const Journal = () => {
  // Array of journal entries
  const journalEntries = [
    {
      username: "FilmBuff123",
      date: "March 15, 2024",
      review:
        '"An absolute masterpiece that pushes the boundaries of storytelling. The cinematography is breathtaking..."',
      rating: 4.5,
      img: "./5c289a359baafb45031a30436a9648cd.jpg"
    },
    {
      username: "CinephileQueen",
      date: "March 10, 2024",
      review:
        '"A rollercoaster of emotions with a phenomenal soundtrack. Truly a must-watch for every film lover!"',
      rating: 4.8,
      img: "./356ad48fef9b761e942ae05c526a0a96.jpg"
    },
  ];

  return (
    <div>
      {/* Journal Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container px-4 mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <Badge className="bg-purple-500/10 text-purple-400 mb-3 sm:mb-4">Journal</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Share your thoughts</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Write reviews, create lists, and share your cinematic journey with a community of film lovers.
            </p>
          </div>

          {/* Journal Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {journalEntries.map((entry, index) => (
              <Card
                key={index}
                className="bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-colors"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* User Info Section */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/20 overflow-hidden">
                      <img 
                        src={entry.img} 
                        alt="" 
                        className="w-full h-full rounded-full object-cover object-center" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-200 px-2 py-1 sm:py-2 w-fit bg-purple-300/50 rounded-lg text-xs">
                        {entry.username}
                      </h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {entry.date}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-300 mb-4 text-sm sm:text-base">
                    {entry.review}
                  </p>

                  {/* Rating and Button Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-purple-400 text-sm sm:text-base">
                        {entry.rating}/5
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-purple-400 hover:text-purple-700 text-sm sm:text-base px-2 sm:px-4"
                    >
                      Read more
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journal;