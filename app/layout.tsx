import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RemindMe",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen w-full flex-col items-center dark:bg-black">
            <Navbar />
            <Separator />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
