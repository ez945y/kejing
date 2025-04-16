/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'], // 允许从本地开发服务器加载图片
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5568', // 根据您的API端口调整
                pathname: '/api/images/**',
            },
        ],
    },
}

module.exports = nextConfig 