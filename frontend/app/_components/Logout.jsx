"use client"

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import useUserStore from '@/lib/userStore' // Import your Zustand store

const LogoutButton = () => {
  const router = useRouter()
  const clearUser = useUserStore((state) => state.clearUser) // Access the clearUser action from Zustand

  const handleLogout = () => {
    // Delete the auth cookie
    //document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Clear user data from Zustand store
    clearUser()

    console.log("Logout clicked")

    // Refresh the router to update server components
    router.refresh()

    // Redirect to login page
    router.push('/')
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-transparent border-2 border-purple-700 text-white"
    >
      Logout
    </Button>
  )
}

export default LogoutButton
