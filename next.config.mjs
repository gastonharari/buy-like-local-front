/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    const crmUrl = process.env.NEXT_PUBLIC_CRM_URL ?? "https://concierge-crm.vercel.app"
    return [
      {
        source: "/chat",
        destination: `${crmUrl}/chat`,
      },
    ]
  },
}

export default nextConfig