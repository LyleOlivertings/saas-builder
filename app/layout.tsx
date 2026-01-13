import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils'; // Uses the utilities you asked about

// 1. Load the Inter font (Modern, Clean, Standard for SaaS)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// 2. Define AnyNet SA Branding
export const metadata: Metadata = {
  title: 'AnyNet SA | Intelligent SaaS Engine',
  description: 'The automated platform generator for professional events and businesses.',
  icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#0a0a0a]"> 
      <body 
        className={cn(
          "min-h-screen bg-[#0a0a0a] text-white antialiased selection:bg-blue-500/30",
          inter.className
        )}
      >
        {/* We wrap everything in a simple div here, 
          but you could add global providers (like NextAuth or Toast) here later. 
        */}
        {children}
      </body>
    </html>
  );
}