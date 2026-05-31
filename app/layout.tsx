import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetTrace — Network Device Inventory & IP Conflict Detection",
  description: "Automatically detect, map, and monitor every device on your LAN. Catch IP conflicts before they cause downtime.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
