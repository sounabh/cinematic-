import { Film } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="py-8 md:py-12 border-t border-white/10 bg-black">
        <div className="container px-4 mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and tagline */}
            <div className="text-center sm:text-left">
              <Link href="/" className="inline-flex items-center space-x-2">
                <Image 
                  src="/logo.png" 
                  alt='logo' 
                  width={150} 
                  height={80}
                  className="max-w-[120px] sm:max-w-[150px]"
                />
              </Link>
              <p className="text-sm text-gray-400 mt-3">
                The social network for film lovers.
              </p>
            </div>

            {/* Product links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="mt-8 md:mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Cinematic. All rights reserved. Made by Sounabh.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer