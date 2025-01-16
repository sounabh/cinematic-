"use client"

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { cn } from '@/lib/utils'

const ReviewBox = ({ onSubmit }) => {

  //console.log(onSubmit(rating,review));
  
  // State to track the selected rating (1-5 stars)
  const [rating, setRating] = useState(0)

  // State to track the rating that is being hovered over for dynamic star colors
  const [hoveredRating, setHoveredRating] = useState(0)

  // State to store the written review text
  const [review, setReview] = useState('')

  // State to check if the component has mounted to avoid rendering issues in SSR
  const [isMounted, setIsMounted] = useState(false) 

  // Max characters allowed for the review text
  const maxChars = 400

  // Effect hook to mark the component as mounted after the first render
  useEffect(() => {
    setIsMounted(true) // Set the component as mounted
  }, [])

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Ensure rating and review are provided before submitting
    if (onSubmit && rating && review.trim()) {
      onSubmit(rating, review)
    }
  }

  // If component is not yet mounted, render nothing or a loading state
  if (!isMounted) {
    return null
  }

  return (
    <div className={cn("bg-white/5 rounded-lg p-4 space-y-4")}>
      
      {/* Title Section */}
      <h3 className="text-lg font-bold">Rate & Review</h3>

      {/* Star Rating Section */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => ( //array from return an array hence used map to remder star 
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)} // Set rating on click
            onMouseEnter={() => setHoveredRating(star)} // Highlight star on hover
            onMouseLeave={() => setHoveredRating(0)} // Remove highlight when hover ends
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm p-1"
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors",
                // Dynamically set color based on rating or hover state
                (hoveredRating ? hoveredRating >= star : rating >= star)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              )}
            />
            <span className="sr-only">Rate {star} stars</span>
          </button>
        ))}
      </div>

      {/* Review Text Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* Textarea for writing the review */}
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)} // Update review state on text change
            placeholder="Write your review..."
            maxLength={maxChars} // Limit character length
            className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
          {/* Character count display */}
          <div className="text-right text-sm text-gray-400">
            {review.length}/{maxChars}
          </div>
        </div>

        {/* Submit Button Section */}
        <Button 
          type="submit"
          disabled={!rating || !review.trim()} // Disable button if rating or review is missing
          className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Review
        </Button>
      </form>
    </div>
  )
}

export default ReviewBox
