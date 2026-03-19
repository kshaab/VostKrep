import path from "path";

const nextConfig = {
  turbopack: {},
  reactStrictMode: true,
  webpack: (config: { resolve: { alias: { [x: string]: string; }; }; }) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;

