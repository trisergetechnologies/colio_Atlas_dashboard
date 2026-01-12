"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export default function ProtectedRoutes({
  children,
}: ProtectedRoutesProps) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  /**
   * CRITICAL:
   * Do NOT render anything while auth is resolving.
   * This is what prevents flicker.
   */
  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
