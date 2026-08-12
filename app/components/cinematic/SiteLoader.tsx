"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteLoaderProps {
  onComplete: () => void;
}

export function SiteLoader({ onComplete }: SiteLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-4xl font-black text-white tracking-tight mb-8">
            Legit<span className="text-primary">Ventures</span>
          </div>

          <div className="w-48 h-[2px] bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          <div className="mt-4 mono-label text-dark-400">
            {Math.min(Math.round(progress), 100)}%
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
