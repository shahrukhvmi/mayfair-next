// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
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
