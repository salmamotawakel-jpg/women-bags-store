
import type { Metadata } from "next";
// @ts-ignore
import "../globals.css";

import Header from "../../components/Header";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    template: "%s - Women-B",
    default: "Women-B",
  },
  description: "متجر تفوكت الإلكتروني – كل ما تحتاجه في مكان واحد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      
    </ClerkProvider>
  );
}