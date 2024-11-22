
/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname:'picsum.photos',
                pathname:'/**',
                protocol:'https'
            },
            {
                hostname:'cdn-icons-png.flaticon.com',
                pathname:'/**',
                protocol:'https'
            },
        ],
    },
};

export default nextConfig;
