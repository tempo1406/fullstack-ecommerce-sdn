import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "./components/MainLayout";
import AuthProvider from "./components/AuthProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "StyleHub - E-commerce Clothing Store",
    description: "Find the latest clothing trends at StyleHub",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 transition-colors duration-200`}
            >
                <AuthProvider>
                    <MainLayout>{children}</MainLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
