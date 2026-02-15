import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Parse, organize, and track your recipes",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="en" className="dark">
        <body className="bg-zinc-950 text-zinc-100 min-h-screen flex">
          <Sidebar />
          <main className="flex-1 ml-56 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
