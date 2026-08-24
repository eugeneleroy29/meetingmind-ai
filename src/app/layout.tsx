import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetingMind AI — Voice & Meeting Intelligence Engine',
  description:
    'Sub-second audio transcription, executive briefings, and automated action item extraction powered by Groq Whisper and Compound LLMs.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 6V2'/><path d='M12 22v-4'/><path d='M20 12h4'/><path d='M2 12h4'/><circle cx='12' cy='12' r='4'/><path d='m4.93 4.93 2.83 2.83'/><path d='m16.24 16.24 2.83 2.83'/><path d='m4.93 19.07 2.83-2.83'/><path d='m16.24 7.76 2.83-2.83'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}