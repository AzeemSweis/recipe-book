import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Parse, organize, and track your recipes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-300">
          <ThemeProvider>
            <Sidebar />
            <main className="min-h-screen p-6 pt-16 md:pt-8 md:ml-64">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
