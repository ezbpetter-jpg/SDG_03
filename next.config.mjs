/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@libsql/client"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
