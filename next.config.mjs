/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'earthbyhumans.s3-eu-central-2.ionoscloud.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    serverExternalPackages: ['js-cookie'],
};

export default nextConfig;
