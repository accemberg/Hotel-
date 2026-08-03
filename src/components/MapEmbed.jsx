/**
 * MapEmbed — Reusable Google Maps iframe
 *
 * Takes a bare iframe src URL (mapEmbedUrl from siteConfig) and renders
 * it consistently: 0 border-radius, hairline border, no shadow.
 * Used on /about and /contact.
 *
 * @param {{ mapEmbedUrl: string, height?: string, title?: string }} props
 */
export default function MapEmbed({ mapEmbedUrl, height = '26rem', title = 'Moksh Haveli Inn on Google Maps' }) {
  if (!mapEmbedUrl) return null;

  return (
    <div
      style={{
        width: '100%',
        height,
        border: '1px solid #4A3B2C',   /* hairline — intentional */
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: '#bfb4a3',    /* linen fallback while loading */
      }}
    >
      <iframe
        src={mapEmbedUrl}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
