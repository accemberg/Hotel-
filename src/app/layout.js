import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Moksh Haveli Inn — Heritage Boutique Guest House, Varanasi',
  description:
    'Experience the warmth of heritage hospitality at Moksh Haveli Inn, Varanasi. Boutique rooms with balconies, city views, and authentic charm. Book direct or via MakeMyTrip, Booking.com & more.',
  keywords: 'Moksh Haveli Inn, Varanasi hotel, heritage guest house, boutique hotel Varanasi, haveli stay',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
