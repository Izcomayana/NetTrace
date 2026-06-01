import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetTrace — Network Device Inventory & IP Conflict Detection",
  description: "Automatically detect, map, and monitor every device on your LAN. Catch IP conflicts before they cause downtime.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%2303070f'/><rect x='13' y='13' width='6' height='6' fill='%2300e5ff'/><rect x='11' y='11' width='10' height='10' fill='none' stroke='%2300e5ff' stroke-width='1'/><rect x='8' y='8' width='16' height='16' fill='none' stroke='%2300e5ff' stroke-width='0.5' opacity='0.4'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


// import type { Metadata } from "next";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "NetTrace — Network Device Inventory & IP Conflict Detection",
//   description: "Automatically detect, map, and monitor every device on your LAN. Catch IP conflicts before they cause downtime.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }
