import { Outfit } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/app/_components/ui/toaster"
import { ToastProvider } from "@/app/_components/ui/toast"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata = {
  title: "Cinematic",
  description: "Track, Rate and Chat about your favorite films",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${outfit.variable} antialiased overflow-y-auto overflow-x-hidden`}
      >
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}

