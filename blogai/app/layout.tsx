import type { Metadata } from "next";
import { IBM_Plex_Sans as Fontsans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/home/Header";
import {Toaster} from "@/components/ui/sonner";
import { ORIGIN_URL } from "@/lib/constants";


const fontsans = Fontsans({
  subsets:["latin"],
  weight:["300","400","500","600"],
  variable:"--font-sans",
})

export const metadata: Metadata = {
  title: "BlogAi App",
  description: "Generate Blog posts from Video or audios using ai",
  metadataBase:new URL(ORIGIN_URL),
  alternates:{
    canonical:ORIGIN_URL,
  }
};

export default function RootLayout({   
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontsans.variable
        )}>
         <Header></Header>
       <main>{children}</main>
        <Toaster position="top-center"/>
      </body>
    </html>
     </ClerkProvider>)
}
