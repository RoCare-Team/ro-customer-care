/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.waterpurifierservicecenter.in"], // ✅ allow this domain
  },

  async redirects() {
    return [
      {
        source: "/:path*.php",
        destination: "/:path*",
        permanent: true, // ✅ SEO friendly redirect (301)
      },
    ];
  },
};

export default nextConfig;
