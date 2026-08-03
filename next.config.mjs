/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Turbopack from bundling server-only packages that rely on
  // Node.js built-ins (firebase-admin, resend). Without this, Turbopack
  // resolves internal paths as `undefined`, causing:
  //   TypeError: The "to" argument must be of type string. Received undefined
  serverExternalPackages: ['firebase-admin', 'resend', '@firebase/firestore'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'pidjqlxcqtxocpshixnw.supabase.co',
      },
    ],
  },
};

export default nextConfig;
