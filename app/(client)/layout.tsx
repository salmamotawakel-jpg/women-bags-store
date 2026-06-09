// app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "../../components/Header";

export const metadata: Metadata = {
  title: {
    template: "%s - Women-B",
    default: "Women-B",
  },
  description: "متجر women-b الإلكتروني – كل ما تحتاجه في مكان واحد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="pt-20">
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}