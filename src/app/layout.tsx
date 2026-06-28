import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calyx AI',
  description: 'Personal Nutrition Dashboard',
  icons: {
    icon: '/logo1.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex justify-center bg-primary-container relative pb-[80px]`}>
        <div className="w-full flex justify-center">
          <QueryProvider>
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
