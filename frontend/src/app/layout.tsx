import { Header } from "@/shared/ui";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "E-commerce with checkout",
  description: "E-commerce app with checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${libre.className}`}>
      {/* <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Page Title</title>
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
      </head> */}
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "var(--font-libre), serif",
                colorPrimary: "#848484",
              },
            }}
          >
            <Header />
            <div className={`${styles.container}`}>{children}</div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
