
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
            {
                hostname:'res.cloudinary.com',
                pathname:'/**',
                protocol:'https'
            },
        ],
        domains: ['res.cloudinary.com']
    },
};

export default nextConfig;
