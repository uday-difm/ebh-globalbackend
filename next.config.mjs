/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'earthbyhumans.s3-eu-central-2.ionoscloud.com',
        port: '', // Leave empty if no specific port is used
        pathname: '/**', // This allows any path on the hostname
      },
    ],
  },
};

export default nextConfig;