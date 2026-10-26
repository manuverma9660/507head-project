import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  images: {
    // Editors may use a public image URL from any host. Serve it directly so
    // an unfamiliar domain never causes a Vercel Image Optimizer 400 error.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sc0.blr1.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.assettype.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.bhaskarassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img-cdn.krishijagran.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ammakithaali.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mahadhan.co.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.mahadhan.co.in",
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  trailingSlash: true,
};

export default nextConfig;
