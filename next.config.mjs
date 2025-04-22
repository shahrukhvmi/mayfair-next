// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ tells Next.js to generate /out on build
  trailingSlash: true, // (optional) for proper folder-based routing
  async redirects() {
    return [
      {
        source: '/',
        destination: '/step1',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
