import { cn } from '@/shared/lib/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import Providers from './providers';
import { Toaster } from '@/shared/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = 'https://syncly-virid.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Syncly',
    template: '%s | Syncly',
  },
  description: '목적에 맞는 워크스페이스로 팀의 협업을 한곳에서 관리하는 Syncly입니다.',
  applicationName: 'Syncly',
  icons: {
    icon: [{ url: '/images/auth/login-symbol.png', type: 'image/png' }],
    apple: [{ url: '/images/auth/login-symbol.png', type: 'image/png' }],
  },
  openGraph: {
    title: 'Syncly',
    description: '목적에 맞는 워크스페이스로 팀의 협업을 한곳에서 관리하세요.',
    siteName: 'Syncly',
    locale: 'ko_KR',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: '/images/meta_image.png',
        width: 1200,
        height: 640,
        alt: 'Syncly - 목적에 맞는 워크스페이스 협업 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syncly',
    description: '목적에 맞는 워크스페이스로 팀의 협업을 한곳에서 관리하세요.',
    images: ['/images/meta_image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
