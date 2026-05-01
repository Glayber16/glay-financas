import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/layout/sidebar';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Fintrack',
  description: 'Gerenciador de Finanças Pessoais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}