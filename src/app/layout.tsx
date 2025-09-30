import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import FallingLeaves from '@/components/FallingLeaves';
import FallingRain from '@/components/FallingRain';
import Lightning from '@/components/Lightning';

export const metadata: Metadata = {
  title: 'Tauri Kanban',
  description: 'A Kanban board application created with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FallingLeaves />
          <FallingRain />
          <Lightning />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
