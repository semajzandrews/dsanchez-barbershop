import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D'sanchez Barbershop · East Orange, NJ",
  description:
    "Dominican barbershop at 299 Park Ave, East Orange. Fades, tapers, lineups, hot-towel shaves. 8+ barbers, walk-ins welcome, 7 days a week. Call (862) 252-7966.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect x='2' y='2' width='36' height='36' rx='9' fill='%230d0a07' stroke='%23d9a63f' stroke-width='2.5'/%3E%3Cpath d='M13 11h7c5.5 0 9 3.6 9 9s-3.5 9-9 9h-7V11zm5 4.5v9h2c2.9 0 4.6-1.7 4.6-4.5s-1.7-4.5-4.6-4.5h-2z' fill='%23d9a63f'/%3E%3Cpath d='M8 26l24-14' stroke='%23c0392b' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
