"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Menu, MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import LogoutButton from './Logout'
import useUserStore from '@/lib/userStore'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/_components/ui/sheet"

const NavItems = () => (
  <>
    <Link href="/ai" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
      AI
    </Link>
    <Link href="/lists" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
      Lists
    </Link>
    <Link href="/members" className="text-sm font-medium text-white hover:text-purple-400 transition-colors">
      Members
    </Link>
  </>
)

export default function Navbar() {
  const user = useUserStore((state) => state.user)

  return (
    <header className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-sm border-b border-white/10 max-w-screen-lg mx-auto">
      <nav className=" px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 w-[120px]">
          <Image src="/logo.png" alt="logo" width={120} height={40} className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8 lg:space-x-10">
          {user ? (
            <>
              <div className="flex items-center gap-8">
                <NavItems />
              </div>
              <div className="flex items-center gap-5">

              <Link 
                  href="/message" 
                  className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 text-white font-medium"
                >
                  <span className="text-sm">
                    <MessageCircle className='w-4 h-4 text-purple-200 fill-purple-400'></MessageCircle>
                  </span>
                </Link>

                <Link 
                  href="/profile" 
                  className="relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 text-white font-medium"
                >
                  <span className="text-sm">{user.username[0].toUpperCase()}</span>
                </Link>
                <LogoutButton />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="text-white hover:text-purple-400">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-white/10">
            <nav className="flex flex-col gap-6 mt-6">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 text-white">
                      <span className="text-sm">{user.username[0].toUpperCase()}</span>
                    </div>
                    <span className="text-white font-medium">Profile</span>
                  </Link>


                  <Link href="/message" className="flex items-center gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-900 text-white">
                    <span className="text-sm">
                    <MessageCircle className='w-4 h-4 text-purple-200 fill-purple-400'></MessageCircle>
                  </span>
                    </div>
                    <span className="text-white font-medium">Profile</span>
                  </Link>



                  
                  <div className="flex flex-col gap-4">
                    <NavItems />
                  </div>
                  <LogoutButton />
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button variant="ghost" asChild className="w-full border border-purple-400 text-white">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

