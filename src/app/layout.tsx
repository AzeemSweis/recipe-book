import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Recipe Book",
  description: "Parse, organize, and track your recipes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-56 p-8 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
