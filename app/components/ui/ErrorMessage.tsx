"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = "Something went wrong",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-dark-300" />
      </div>
      <h3 className="text-sm font-semibold text-dark-500">{message}</h3>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 t-mono text-[0.5rem] text-dark-500 hover:text-dark-700 rounded-lg transition-all duration-300"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
