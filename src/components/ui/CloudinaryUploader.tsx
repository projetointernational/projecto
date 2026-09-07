'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Check, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  currentImageUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  currentImageUrl,
  onUploadSuccess,
  folder = 'projects',
  label = 'Upload Image',
  aspectRatio = 'wide',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
    setImageError(false);
  }, [currentImageUrl]);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-[16/9]',
    wide: 'aspect-[21/9]',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onUploadSuccess('');
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative w-full ${aspectClasses[aspectRatio]} bg-sand/30 rounded-sm overflow-hidden flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 hover:bg-sand/60 ${
          isUploading ? 'opacity-70 cursor-wait' : ''
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {previewUrl ? (
          <div className="relative w-full h-full">
            {imageError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-sand/50 text-center">
                <ImageIcon className="w-8 h-8 text-warm-grey mb-1" />
                <span className="text-xs text-near-black font-medium">Image preview unavailable</span>
                <span className="text-[10px] text-warm-grey truncate max-w-full px-2">{previewUrl}</span>
              </div>
            ) : (
              <Image
                src={previewUrl}
                alt="Uploaded visual"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
            )}
            <div className="absolute inset-0 bg-near-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <span className="text-xs uppercase tracking-wider text-white bg-near-black/80 px-3 py-1.5 rounded-sm flex items-center space-x-1">
                <UploadCloud className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} /> Replace
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs uppercase tracking-wider text-white bg-red-800/80 hover:bg-red-800 px-3 py-1.5 rounded-sm flex items-center"
              >
                <X className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 border-2 border-olive border-t-transparent rounded-full animate-spin" />
                <span className="text-xs tracking-wide text-olive font-medium">
                  Uploading to Cloudinary...
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-sm bg-sand flex items-center justify-center text-warm-grey mb-3 group-hover:text-olive transition-colors">
                  <UploadCloud className="w-5 h-5" strokeWidth={1.25} />
                </div>
                <p className="text-xs font-medium text-near-black tracking-wide mb-1">
                  Click to select architectural imagery
                </p>
                <p className="text-[11px] text-warm-grey">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-700">{error}</p>
      )}
    </div>
  );
};
