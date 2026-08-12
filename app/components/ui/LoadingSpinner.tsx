"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-dark-300 ${className}`}
      size={size}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={36} />
        <p className="t-mono text-[0.5rem] text-dark-400">Loading...</p>
      </div>
    </div>
  );
}
