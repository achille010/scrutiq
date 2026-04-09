import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HireIQ | Technical Recruitment Portal",
  description: "Modern administrative portal for technical talent assessment and recruitment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${jakarta.variable} font-jakarta antialiased text-aurora-muted bg-aurora-bg selection:bg-aurora-blue/20 selection:text-aurora-blue`}>
        <Providers>
          {children}
          <Toaster 
            richColors 
            position="top-right" 
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
