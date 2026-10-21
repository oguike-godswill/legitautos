"use client";

import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-dark-700">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-dark-900
            placeholder:text-dark-400
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all resize-y
            ${error ? "border-danger/40" : "border-gray-200"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && <p className="text-xs text-dark-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
