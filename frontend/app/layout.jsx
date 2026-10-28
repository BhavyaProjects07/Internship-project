import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Modern Agency — Digital Experiences Built for Ambitious Brands",
  description: "Independent creative studio engineering digital flagships, brand systems, and high-performance web products.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"&&typeof Event!=="undefined"&&!Event.prototype.getModifierState){Event.prototype.getModifierState=function(){return false;};}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
