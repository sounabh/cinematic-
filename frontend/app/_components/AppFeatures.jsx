import { Badge, PlayCircle, TrendingUp, Users } from 'lucide-react';
import React from 'react';

const AppFeatures = () => {
  // Array of features with icon, title, and description
  const features = [
    {
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />,
      title: "Track Progress",
      description: "Keep track of your watching statistics and progress.",
    },
    {
      icon: <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />,
      title: "Watch Trailers",
      description: "Watch trailers and clips directly in the app.",
    },
    {
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />,
      title: "Social Features",
      description: "Follow friends and share your watching experience.",
    },
  ];

  return (
    <div>
      {/* App Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-14 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            
            {/* Textual Content */}
            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              <Badge className="bg-purple-500/10 text-purple-400">App Features</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 md:mb-10">
                Track your cinematic journey
              </h2>
              <div className="space-y-6 sm:space-y-8 md:space-y-11">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-purple-500/10 p-2 rounded-lg shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual Content */}
            <div className="relative mt-8 md:mt-20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-3xl opacity-20"></div>
              <div className="relative aspect-[4/3] w-full">
                <img
                  src="/WhatsApp Image 2025-01-11 at 15.28.45_c78859d1.jpg"
                  alt="App screenshot"
                  className="rounded-lg border border-purple-500/20 object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppFeatures;