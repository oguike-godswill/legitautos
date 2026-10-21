"use client";

import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-dark-700">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-dark-900
              placeholder:text-dark-400
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "border-danger/40 focus:ring-danger/20 focus:border-danger/50" : "border-gray-200"}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
        {helperText && !error && (
          <p className="text-xs text-dark-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
