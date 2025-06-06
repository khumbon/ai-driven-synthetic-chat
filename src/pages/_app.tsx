import '../styles/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import type { AppProps } from 'next/app';
import { Layout } from '@/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Component {...pageProps} />
        </div>
      </Layout>
    </QueryClientProvider>
  );
}
