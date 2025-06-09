/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure output is set to export for static sites, or remove this for server-rendered
  // output: 'export', // Remove this line if you're using server-rendered
  
  // Make sure there are no experimental features causing issues
  reactStrictMode: true,
  
  // If you're using rewrites or redirects, keep them simple for now
  
  // Add this if you're dealing with image optimization
  images: {
    domains: ['images.unsplash.com'], // Add any domains you're loading images from
  },
};

export default nextConfig;
