import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/lib/providers";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { CommonLayout } from "@/layouts/common-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account SDK | Sophon",
  description: "Developer documentation for Sophon Account SDK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <CommonLayout>{children}</CommonLayout>
        </Providers>
      </body>
    </html>
  );
}
