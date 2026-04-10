import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angular Component Analyzer",
  description: "Analyze, document, and improve Angular components with AI-driven insights (no fake UI previews)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}