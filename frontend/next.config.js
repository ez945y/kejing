/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5568',
                pathname: '/api/images/**',
            },
        ],
    },
}

module.exports = nextConfig 