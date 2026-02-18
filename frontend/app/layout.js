import { Inter } from "next/font/google";
import "../styles/globals.scss";
import AuthProviderWrapper from './context/Providers';
import { Providers } from "./providers";
import NotificationToastWrapper from './components/NotificationToastWrapper';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProviderWrapper>
          <Providers>
            {children}
            <NotificationToastWrapper />
          </Providers>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
