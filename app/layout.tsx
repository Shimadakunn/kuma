import Provider from "@/components/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from 'sonner'
import Footer from "@/components/footer";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Provider>
          <div className="flex">
            <Footer />
            <div className="flex flex-col w-full">
              <Header />
              {children}
            </div>
          </div>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
