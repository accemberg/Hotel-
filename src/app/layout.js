import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';
import ScrollToTop from '@/components/ScrollToTop';

const cormorant = Cormorant_Garamond({
  variable: '--font-tt-ramillas-variable', // mapped to design system token name
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-satoshi',              // mapped to design system token name
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const SITE_URL = 'https://mokshhaveliinn.com';
const OG_IMAGE = '/hotelpics/hotel_banner_outside.jpeg';

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Moksh Haveli Inn — Heritage Boutique Guest House, Varanasi',
    template: '%s — Moksh Haveli Inn',
  },

  description:
    'Experience the warmth of heritage hospitality at Moksh Haveli Inn, Varanasi. Boutique rooms with private balconies, city views, and authentic haveli charm. Book direct or via MakeMyTrip & Booking.com.',

  keywords: [
    'Moksh Haveli Inn',
    'Varanasi hotel',
    'heritage guest house',
    'boutique hotel Varanasi',
    'haveli stay',
    'Assi Ghat hotel',
    'Varanasi accommodation',
  ],

  authors: [{ name: 'Moksh Haveli Inn', url: SITE_URL }],
  creator: 'Moksh Haveli Inn',
  publisher: 'Moksh Haveli Inn',

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Moksh Haveli Inn',
    title: 'Moksh Haveli Inn — Heritage Boutique Guest House, Varanasi',
    description:
      'A heritage boutique guest house steps from the ghats of Varanasi. Private balconies, heritage warmth, modern comfort.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Moksh Haveli Inn — Heritage Stay, Varanasi',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Moksh Haveli Inn — Heritage Stay, Varanasi',
    description:
      'A heritage boutique guest house steps from the ghats of Varanasi. Private balconies, heritage warmth, modern comfort.',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ClientProviders>
          {children}
          <ScrollToTop />
        </ClientProviders>
      </body>
    </html>
  );
}
