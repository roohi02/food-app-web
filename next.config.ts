const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
         hostname: "www.themealdb.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;