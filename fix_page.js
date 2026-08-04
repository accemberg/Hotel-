const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'page.js');
const content = fs.readFileSync(filePath, 'utf8');

const startMarker = `        {/* ── GALLERY PREVIEW ───────────────────────────────────── */}`;
const endMarker = `                    padding: '2.5rem 2rem',`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found:", { startIndex, endIndex });
  process.exit(1);
}

const replacement = `        {/* ── GALLERY PREVIEW ───────────────────────────────────── */}
        <section
          ref={galleryRef}
          data-section="gallery-preview"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <SectionHeader caption="Gallery" heading="The Property" size="heading-sm" surface="light" />
              <a
                href="/gallery"
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#000000',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.25rem',
                  opacity: 0.7,
                }}
              >
                Full Gallery →
              </a>
            </div>
            <div
              className="gallery-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
            >
              {gallery.map(item => (
                <div
                  key={item.id}
                  style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption || item.category}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1rem',
                      background: 'linear-gradient(transparent, rgba(41,38,34,0.7)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: '#000000',
                    }}>
                      {item.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── OTA BOOK ON… ───────────────────────────────────────── */}

        <section
          data-section="ota"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Online Travel Agencies"
              heading="Book on …"
              subtext="Find us on major booking platforms — or reach out directly for the best rate."
              size="heading-sm"
              surface="light"
            />
            <div
              className="ota-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
                gap: '1px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
                marginTop: '3rem',
              }}
            >
              {otaLinks.filter(o => o.active).map(ota => (
                <div
                  key={ota.id}
                  style={{
                    backgroundColor: 'var(--color-cream-deep)',
`;

const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed page.js successfully!');
