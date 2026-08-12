"use client";

import { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`flex items-center gap-2.5 cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          {...props}
        />
        {label && <span className="text-sm text-dark-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
