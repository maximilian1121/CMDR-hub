import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Footer from "./footer";
import "./globals.css";
import AppThemeProvider from "./theme-provider";
import { Box } from "@mui/material";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    icons: {
        icon: "/cmdr-hub-logo.svg",
    },
    title: "CMDR Hub",
    description: "The best way to distribute your CMDR commands!",
};

const roboto = Roboto({
    variable: "--font-roboto",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${roboto.className} antialiased`}>
                <AppThemeProvider>
                    {children}
                    <Footer />
                </AppThemeProvider>
            </body>
        </html>
    );
}
