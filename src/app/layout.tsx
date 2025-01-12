import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { AuthProvider } from "@/features/auth/provider/AuthProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`font-lexend antialiased`}>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </AuthProvider>
  );
}
