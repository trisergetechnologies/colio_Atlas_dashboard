import type { PropsWithChildren } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Wallet & Logs",
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
