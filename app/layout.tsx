import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css'; // Global styles
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '700', '900']
});

export const metadata: Metadata = {
  title: 'AnimeVibe - Rating',
  description: 'Evaluate your favorite anime on AnimeVibe',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased min-h-screen bg-[#050510] text-white font-body flex flex-col" suppressHydrationWarning>
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster theme="dark" toastOptions={{
          style: { background: '#111126', border: '1px solid #8b5cf6', color: '#fff' }
        }} />
      </body>
    </html>
  );
}
