import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StripeProvider } from "@/providers/StripeProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});





export const metadata: Metadata = {
  title: "Global Dry Cleaners",
  description: "",
  icons: "/favicon.webp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
