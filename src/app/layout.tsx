import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";
import { Provider } from "@/components/ui/provider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

import "./globals.css";
import { Flex } from "@chakra-ui/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Riskycase's Journal Application",
  description: "Simple on device journal application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <Provider>
          <Flex
            direction="column"
            minHeight="100vh"
            backgroundColor="gray.900"
            color="gray.50"
            maxWidth="100vw"
            boxSizing="border-box"
          >
            {children}
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
