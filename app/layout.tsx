import { Web3AuthProvider } from "@/services/web3auth";
import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from 'sonner';

const font = localFont({ src: '../public/fonts/space.ttf' });

export const metadata: Metadata = {
  title: "Kuma",
  description: "Access to blockchain without the hassle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Web3AuthProvider>
          <div className="flex">
            <Footer />
            <div className="flex flex-col w-full">
              <Header />
              {children}
            </div>
          </div>
        </Web3AuthProvider>
        <Toaster richColors/>
      </body>
    </html>
  );
}
