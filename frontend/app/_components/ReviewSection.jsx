import React from 'react';
import { Star, Heart } from 'lucide-react';

const MovieReviews = ({ reviews = [] }) => {
  const baseImageLink = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-400 fill-amber-700" />
        <span className="text-purple-200 font-medium">{Number(rating).toFixed(1)}</span>
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="mt-8 px-4 sm:px-6 md:px-12 lg:px-24">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-purple-100">Reviews</h2>
        <p className="text-purple-300/60">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 md:px-12 lg:px-24">
      {/* Section heading */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-purple-100">Reviews</h2>

      {/* Container for all reviews */}
      <div className="space-y-4 sm:space-y-6">
        {reviews?.map((review, ind) => (
          <div 
            key={ind} 
            className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-purple-900/30 shadow-lg"
            style={{
              backgroundImage: 'linear-gradient(to bottom right, rgba(91, 33, 182, 0.1), rgba(0, 0, 0, 0))'
            }}
          >
            {/* Review header containing user details and rating */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* User avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-purple-500/30 flex-shrink-0">
                  <img
                    src={`${baseImageLink}${review?.user?.userImage}` || "/api/placeholder/40/40"}
                    alt={review?.user?.username || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* User name and review count */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-sm sm:text-base text-purple-100">
                      {review?.user?.username || "Anonymous User"}
                    </h3>
                    {review.isVerified && (
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
                        Verified
                      </span>
                    )}
                  </div>
                  {review?.user?.reviewCount && (
                    <p className="text-xs sm:text-sm text-purple-400/60">
                      {review.user.reviewCount} reviews
                    </p>
                  )}
                </div>
              </div>

              {/* Rating stars and review date */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                {renderStars(review.rating)}
                <span className="text-purple-400">
                  {new Date(review.createdAt || review.date).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Review content */}
            <p className="text-sm sm:text-base text-gray-300/90 mb-4 leading-relaxed">
              {review.review || review.content}
            </p>

            {/* Like button */}
            <div className="flex items-center">
              <button className="flex items-center gap-2 text-xs sm:text-sm text-purple-400/60 hover:text-purple-300 transition-colors duration-200 group">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 group-hover:fill-purple-500" />
                {review.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieReviews;

