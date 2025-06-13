import "../globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/Header";

export const metadata: Metadata = {
    title: "Firebase Auth Demo",
    description: "Next.js and Express with Firebase",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-[#f6fdfe]">
                <AuthProvider>
                    {<Header />}
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
