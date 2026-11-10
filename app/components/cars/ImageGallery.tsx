"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Grid,
  Camera,
} from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const validImages =
    images && images.length > 0 ? images : ["/images/placeholder-car.jpg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = validImages[selectedIndex] || validImages[0];

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  }, [validImages.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, nextImage, prevImage]);

  const openAt = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Bento Grid on Desktop when >= 3 images, otherwise single hero frame */}
      {validImages.length >= 3 ? (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
          {/* Primary Hero Image */}
          <div
            className="relative aspect-[3/2] cursor-zoom-in overflow-hidden rounded-2xl bg-dark-100 md:col-span-8 group"
            onClick={() => openAt(selectedIndex)}
          >
            <Image
              src={currentImage}
              alt={`${title} — main view`}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

            {/* Mobile Prev/Next Overlay Buttons */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark-900 shadow-md md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark-900 shadow-md md:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <Camera className="h-3.5 w-3.5 text-teal" />
                {selectedIndex + 1} / {validImages.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-dark-900 shadow-sm hover:bg-white"
              >
                <Grid className="h-3.5 w-3.5 text-teal" />
                Fullscreen Gallery
              </button>
            </div>
          </div>

          {/* Right Side Bento Stack (Desktop) */}
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-2.5">
            {validImages.slice(1, 3).map((img, i) => {
              const actualIdx = i + 1;
              const isLastTile = i === 1 && validImages.length > 3;
              return (
                <button
                  key={actualIdx}
                  type="button"
                  onClick={() => openAt(actualIdx)}
                  className="group relative w-full h-full overflow-hidden rounded-2xl bg-dark-100 text-left"
                >
                  <Image
                    src={img}
                    alt={`${title} — angle ${actualIdx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                  {isLastTile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-[2px] transition-colors group-hover:bg-ink/70">
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-3.5 py-2 text-xs font-extrabold text-white">
                        <ZoomIn className="h-4 w-4" />
                        +{validImages.length - 3} More Photos
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-dark-100 cursor-zoom-in group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={currentImage}
            alt={`${title} — photo ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
            priority
          />
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-dark-900 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <ZoomIn className="w-3.5 h-3.5 text-teal" />
            <span>
              {selectedIndex + 1} / {validImages.length}
            </span>
          </div>
        </div>
      )}

      {/* Horizontal Thumbnail Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {validImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View photo ${index + 1}`}
              className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-dark-100 transition-all ${
                index === selectedIndex
                  ? "ring-2 ring-teal ring-offset-2 opacity-100"
                  : "opacity-65 hover:opacity-100"
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

      {/* Accessible Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo gallery`}
            className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                {selectedIndex + 1} of {validImages.length} — {title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close fullscreen gallery"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prev Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 rounded-full text-white hover:bg-white/25 transition-colors z-10 flex items-center justify-center"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Main Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={`${title} — full view ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Next Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 rounded-full text-white hover:bg-white/25 transition-colors z-10 flex items-center justify-center"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
