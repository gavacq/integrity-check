// @ts-check
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return {
      // TODO: try just a simple rewrite instead of beforeFiles (thought ...not_found was causing issues)
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
