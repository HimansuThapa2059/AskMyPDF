import type { Metadata } from 'next';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const poppins = Poppins({
  weight: ['400', '700'], // Specify the weights you want
  subsets: ['latin'], // Specify subsets (like latin)
});

export const metadata: Metadata = {
  title: 'AskMyPDF',
  description: 'Build using nextJS.14',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen antialiased grainy', poppins.className)}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
