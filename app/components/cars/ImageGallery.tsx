"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || "/images/placeholder-car.jpg";

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-2.5">
      {/* Main Image — 3:2 at every size, matching the ratio uploads are
          normalised to, so object-cover fills the frame without cropping and
          without the letterboxing that made the car look zoomed out. */}
      <div
        className="relative aspect-[3/2] rounded-xl overflow-hidden bg-dark-900/[0.04] cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={currentImage}
          alt={`${title} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-dark-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="t-mono text-[0.5rem]">{selectedIndex + 1} / {images.length}</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-18 h-12 rounded-lg overflow-hidden bg-dark-900/[0.04] transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 text-white/60 hover:text-white transition-colors z-10 safe-top"
            >
              <X className="w-7 h-7" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 bg-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl aspect-[3/2] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={`${title} - Full view`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-3 bg-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-colors z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white/70 px-4 py-2 rounded-full t-mono text-[0.5rem]">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
