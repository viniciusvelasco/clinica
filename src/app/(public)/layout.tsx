"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  // Forçar tema light para as rotas públicas
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
} 