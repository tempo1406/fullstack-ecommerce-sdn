import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      'encrypted-tbn1.gstatic.com',
      'encrypted-tbn0.gstatic.com',
      'encrypted-tbn2.gstatic.com',
      'encrypted-tbn3.gstatic.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'res.cloudinary.com'
    ],
    // Cho phép sử dụng bất kỳ domain nào với remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // Cấu hình bổ sung để tăng cường bảo mật
    unoptimized: process.env.NODE_ENV === 'development',
  }
};

export default nextConfig;
