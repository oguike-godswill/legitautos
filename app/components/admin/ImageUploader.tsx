"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/app/utils/api";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);

      const newImages: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        try {
          const result = await uploadImage(files[i]);
          newImages.push(result.url);
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (error) {
          toast.error(`Failed to upload image ${i + 1}`);
        }
      }

      onImagesChange([...images, ...newImages]);
      setIsUploading(false);
      setUploadProgress(0);

      if (newImages.length > 0) {
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    },
    [images, onImagesChange]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-dark-500">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-dark-400 mb-2" />
              <p className="text-sm text-dark-600">
                <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-dark-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={image}
                alt={`Car image ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary-600 text-white text-[10px] font-medium rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
