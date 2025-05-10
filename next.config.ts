import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
	  return [
		 {
			source: '/',
			destination: '/categories',
			permanent: true, // یا false اگر می‌خواهید ریدایرکت موقتی باشد
		 },
	  ];
	},
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
