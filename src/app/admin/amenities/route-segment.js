// This route segment config file forces all pages under /admin
// to render dynamically (server-side) — never statically pre-rendered.
// This prevents Firestore/Firebase "service unavailable" errors at build time.
export const dynamic = 'force-dynamic';
