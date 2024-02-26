// @ts-check
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  cacheOnFrontEndNav: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/__/auth/:path*',
          destination: 'https://integrity-check-app.firebaseapp.com/__/auth/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withSerwist(nextConfig);
