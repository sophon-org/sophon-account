import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/lib/providers";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { CommonLayout } from "@/layouts/common-layout";
import { headers } from "next/headers";
import { getConfig } from "@/lib/wagmi";
import { cookieToInitialState } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account SDK | Sophon",
  description: "Developer documentation for Sophon Account SDK",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie"),
  );

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <CommonLayout>{children}</CommonLayout>
        </Providers>
      </body>
    </html>
  );
}
