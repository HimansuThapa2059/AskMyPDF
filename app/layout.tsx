import type { Metadata } from "next";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  weight: ["400", "700"], // Specify the weights you want
  subsets: ["latin"], // Specify subsets (like latin)
});

export const metadata: Metadata = {
  title: "AskMyPDF",
  description: "Build using nextJS.14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("grainy min-h-screen antialiased", poppins.className)}
      >
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
