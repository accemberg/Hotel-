# Moksh Haveli Inn — Component Structure (Day 1)
> Branch: `feat/frontend-samarth` · Built by Samarth

## Design System
The project uses the **Amrit Palace** design system (skill: `classyhot`).
All tokens live in `src/app/globals.css` under `@theme { ... }`.

### Quick Token Reference
| Token | Value | Role |
|-------|-------|------|
| `--color-parchment` | `#d8cbb8` | Page canvas (warm beige) |
| `--color-onyx-warm` | `#2c2c2c` | Primary text / dark surface |
| `--color-midnight-roast` | `#292622` | Hero / dark section bg |
| `--color-saffron-glow` | `#d49653` | Accent — stars, active states ONLY |
| `--color-warm-stone` | `#b6ab9c` | 1px hairline borders |
| `--font-display` | Cormorant Garamond 300 | All headings — uppercase |
| `--font-sans` | Inter 500 | Body / nav / labels — uppercase |

### Rules (non-negotiable)
- Cards / images: `border-radius: 0`
- Buttons / tags / inputs: `border-radius: 0.1875rem` (never `3px`)
- No box-shadows. No gradients. Depth = hairlines + tonal shifts.
- Saffron `#d49653` max 2–3 times per screen.
- Headings always: serif weight 300, uppercase, tight negative tracking.
- **Units: use `rem` for all font-sizes and spacing. `em` for letter-spacing. `1px` only for hairline borders.**

---

## Components

### `src/components/Button.jsx`
Ghost / outlined button. Never solid chromatic fill.
```jsx
<Button variant="ghost">Explore Rooms</Button>
<Button variant="ghost-light">Book Now</Button>  // on dark bg
<Button size="sm|md|lg">…</Button>
```

### `src/components/Card.jsx`
Sharp 0px radius wrapper. No shadow.
```jsx
<Card variant="bordered">…</Card>   // with 1px hairline
<Card variant="plain">…</Card>      // no border
```

### `src/components/SectionHeader.jsx`
Display serif heading + optional caption + subtext.
```jsx
<SectionHeader
  caption="Our Rooms"
  heading="Stay in Heritage"
  subtext="…"
  size="heading"          // heading-lg | heading | heading-sm | subheading
  surface="light"         // light | dark
/>
```

### `src/components/RoomCard.jsx`
Room listing card: image, rate tag, meta row, View Room + Enquire CTAs.
```jsx
<RoomCard room={{
  id: 'standard-room-with-balcony',
  name: 'Standard Room with Balcony',
  rate: 1500,
  size: '250 sq ft',
  beds: '1 King Bed',
  max: 3,
  image: null,  // replace with URL from Firebase Storage
}} />
```

### `src/components/Navbar.jsx`
Transparent over hero (absolute-positioned). Solid parchment on other pages.
```jsx
<Navbar variant="transparent" />   // hero pages
<Navbar variant="solid" />         // all other pages
```

### `src/components/Footer.jsx`
Dark (#292622) footer: brand wordmark, nav groups, contact, social/WhatsApp.
```jsx
<Footer />
```

---

## API Mock Shapes (for Adrija)

### GET /api/rooms
```json
[
  {
    "id": "standard-room-with-balcony",
    "name": "Standard Room with Balcony",
    "rate": 1500,
    "qty": 3,
    "size": "250 sq ft",
    "beds": "1 King Bed",
    "max": 3,
    "image": "https://firebasestorage…"
  }
]
```

### GET /api/amenities
```json
[
  { "name": "Air Conditioning", "category": "In-room", "notes": "Split AC" },
  { "name": "Free Wi-Fi",       "category": "In-room", "notes": "Working speed" }
]
```

---

## Pages Completed (Day 1)
- [x] `src/app/layout.js` — root layout, fonts, metadata
- [x] `src/app/globals.css` — design system tokens
- [x] `src/app/page.js` — Home page (hero, rooms grid, amenities, location CTA)

## Pages TODO (Day 2+)
- [ ] `/rooms` — full listing with filter
- [ ] `/rooms/[id]` — room detail with gallery + enquiry form
- [ ] `/amenities` — full grid grouped by category
- [ ] `/gallery` — masonry with lightbox
- [ ] `/about` — heritage story + map
- [ ] `/contact` — form + WhatsApp + Google Map
- [ ] `/book` — OTA deep-links
- [ ] `/admin` — protected CRM panel (Aryan's branch)
