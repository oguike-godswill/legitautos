"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  /** Optional supporting line shown under the title. */
  description?: string;
  /** Optional "view all" link rendered on the right. */
  linkHref?: string;
  linkLabel?: string;
  /** Center the header instead of the default left alignment. */
  align?: "left" | "center";
  /** Invert colours for use on dark backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Shared section heading used across the homepage so every band has the same
 * eyebrow/title rhythm and spacing.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel = "View All",
  align = "left",
  tone = "light",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        isCenter
          ? "flex flex-col items-center text-center"
          : "flex flex-row items-center justify-between gap-4 sm:items-end"
      } ${className}`}
    >
      <div className={isCenter ? "max-w-2xl" : "min-w-0"}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-teal"
        >
          {eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className={`mt-2 text-xl sm:text-2xl lg:text-3xl font-bold uppercase leading-[1.15] tracking-[-0.02em] ${
            isDark ? "text-white" : "text-dark-900"
          }`}
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className={`mt-4 text-sm leading-relaxed ${
              isCenter ? "mx-auto max-w-xl" : "max-w-xl"
            } ${isDark ? "text-white/50" : "text-dark-500"}`}
          >
            {description}
          </motion.p>
        )}
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className={`group inline-flex shrink-0 items-center gap-2 text-xs font-bold transition-colors ${
            isDark ? "text-white/60 hover:text-teal" : "text-dark-500 hover:text-teal"
          }`}
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
