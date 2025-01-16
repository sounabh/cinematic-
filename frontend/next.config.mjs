/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'], // Add the hostname here
  },
  /*async rewrites() {
    return [
      {
        source: '/:path*', 
        destination: 'http://localhost:5000/:path*' // Always proxy to local backend
      }
    ]
  }*/
};

export default nextConfig;
