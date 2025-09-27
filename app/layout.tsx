import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/Footer';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tourismo - Discover Amazing Destinations',
  description: 'Book amazing travel destinations with crypto payments',
};

// This component makes runtime configuration available to the client
function ClientRuntimeConfig() {
  const config = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  };

  return (
    <script
      id="__NEXT_DATA__"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          props: {},
          page: '/',
          query: {},
          buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'development',
          runtimeConfig: config,
        }),
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientRuntimeConfig />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}