import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Parse, organize, and track your recipes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="en" className="dark">
        <body className="bg-zinc-950 text-zinc-100 min-h-screen">
          <Sidebar />
          <main className="min-h-screen p-6 pt-16 md:pt-6 md:ml-60">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
