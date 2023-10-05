"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
