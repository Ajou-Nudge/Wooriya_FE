/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_S3_ACCESS_KEY_ID:"",
        NEXT_PUBLIC_S3_SECRET_ACCESS_KEY:"",
        NEXT_PUBLIC_S3_REGION:""
    },
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "http://localhost:3000/:path*", // rewrite를 통해 브라우저가 아닌 next 서버에서 호출함, destination 에 보내는 request를 source 주소에서의 요청으로 한 것처럼 보여지게 rewrite한다는 의미
        },
      ];
    },
  };
  
  module.exports = nextConfig;