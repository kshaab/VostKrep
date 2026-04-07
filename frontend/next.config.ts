import path from "path";

const nextConfig = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "159.194.223.52",
        pathname: "/media/**",
      },
    ],
  },
  webpack: (config: { resolve: { alias: { [x: string]: string; }; }; }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig

