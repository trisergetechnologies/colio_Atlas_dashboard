"use client";

import { PropsWithChildren } from "react";

export default function HomeLayout({ children }: PropsWithChildren) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
