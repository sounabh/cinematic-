import React from 'react' // Importing React for component creation
import { Button } from './ui/button' // Importing a custom Button component
import Link from 'next/link'

const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-4">
        {/* Container to center and constrain the content */}
        <div className="container">
          
          {/* Centered text and buttons */}
          <div className="max-w-3xl mx-auto text-center space-y-8">

            {/* Hero Heading with gradient text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Track films you've watched.  
              Save those you want to see.
            </h1>

            {/* Supporting paragraph with gray text */}
            <p className="text-xl text-gray-400">
              The social network for film lovers. Use Cinematic to share your taste in film.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              
              {/* Get Started Button with a purple background */}
              <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-lg h-12 px-8">
                Get Started
              </Button>

              {/* How It Works Button with outline styling */}
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-purple-500 text-black/70 hover:bg-purple-500/10 hover:text-white text-lg h-12 px-8"
              >
                <Link href={"/about"}> About Us</Link>
               
              </Button>
            </div>
            {/* End of buttons container */}
          </div>
          {/* End of text and buttons container */}
        </div>
        {/* End of container */}
      </section>
      {/* End of Hero Section */}
    </div>
  )
}

// Exporting the Hero component for use in other parts of the application
export default Hero
