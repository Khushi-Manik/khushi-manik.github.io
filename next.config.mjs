/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-local',
  output: 'export',
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}
export default nextConfig
