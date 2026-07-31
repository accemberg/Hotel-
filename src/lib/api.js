/**
 * @/lib/api — client-side data fetching functions
 *
 * Each function calls the corresponding Next.js API route under /api/.
 * On failure, falls back to the raw mock JSON import so the site
 * never breaks in development.
 */

import roomsMock     from '@/mocks/rooms.json';
import galleryMock   from '@/mocks/gallery.json';
import otaMock       from '@/mocks/ota-links.json';
import configMock    from '@/mocks/site-config.json';
import amenitiesMock from '@/mocks/amenities.json';

async function fetchApi(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    // In dev or if API route missing — use mock data directly
    return fallback;
  }
}

export function getRooms() {
  return fetchApi('/api/rooms', roomsMock);
}

export function getGallery() {
  return fetchApi('/api/gallery', galleryMock);
}

export function getOtaLinks() {
  return fetchApi('/api/ota-links', otaMock);
}

export function getSiteConfig() {
  return fetchApi('/api/site-config', configMock);
}

export function getAmenities() {
  return fetchApi('/api/amenities', amenitiesMock);
}

export function getRoomBySlug(slug) {
  return getRooms().then(rooms => rooms.find(r => r.id === slug) ?? null);
}
