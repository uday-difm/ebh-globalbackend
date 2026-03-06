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
};

export default nextConfig;
