import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from './context/Providers';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Suite",
  description: "A comprehensive task management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
