/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["isomorphic-dompurify", "jsdom", "js-cookie"],
  transpilePackages: ["@yourcompany/global-backend-next"],
  images: {
    unoptimized: true,
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'earthbyhumans.s3-eu-central-2.ionoscloud.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'earthbyhumans.com',
          },
        ],
        destination: 'https://www.earthbyhumans.com/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer || nextRuntime !== "nodejs") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        dns: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("jsdom", "isomorphic-dompurify");
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
