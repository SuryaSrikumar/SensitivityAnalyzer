import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentimentIQ — Stock Sentiment Analyzer",
  description:
    "Educational stock sentiment analysis tool. Not financial advice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
