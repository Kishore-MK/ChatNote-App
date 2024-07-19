import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Theme";
import NavBar from "../components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatNote",
  description: "Create and chat with your notes",
};

export default function RootLayout({children
}: any) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>

        
        <ThemeProvider attribute="class"><NavBar/>{children}</ThemeProvider></main></body>
    </html>
  );
}
