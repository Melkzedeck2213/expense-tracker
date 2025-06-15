"use client";

import React from "react";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="flex flex-col gap-4 w-80">{children}</div>
    </div>
  );
}
