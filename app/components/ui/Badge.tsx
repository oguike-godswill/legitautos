"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gray-100 text-dark-500 border-gray-200",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[0.55rem]",
  md: "px-2.5 py-1 text-[0.6rem]",
};

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}
