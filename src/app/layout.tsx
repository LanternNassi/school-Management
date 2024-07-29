import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import ThemeProviderComponent from "@/components/ThemeProvider";
const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "School Management",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProviderComponent>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeProviderComponent>

  );
}
