'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  Images,
} from 'lucide-react';

interface ProjectGalleryManagerProps {
  galleryImages: string[];
  onChange: (images: string[]) => void;
  onSetMainImage?: (url: string) => void;
  mainImageUrl?: string;
}

export const ProjectGalleryManager: React.FC<ProjectGalleryManagerProps> = ({
  galleryImages = [],
  onChange,
  onSetMainImage,
  mainImageUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMessage(text);
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(text);
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  // Upload handler for single or multiple files
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const uploadedUrls: string[] = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      setUploadProgress({ current: i + 1, total });
      const file = files[i];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects/gallery');

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error('Gallery image upload failed:', err);
        setErrorMessage(
          err instanceof Error
            ? `Upload error on file ${file.name}: ${err.message}`
            : 'Error uploading image to Cloudinary.'
        );
      }
    }

    if (uploadedUrls.length > 0) {
      const updated = [...galleryImages, ...uploadedUrls];
      onChange(updated);
      showNotification(
        'success',
        `Successfully added ${uploadedUrls.length} ${
          uploadedUrls.length === 1 ? 'image' : 'images'
        } to the gallery.`
      );
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add via direct URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      showNotification('error', 'Please enter a valid URL starting with http:// or https://');
      return;
    }

    const updated = [...galleryImages, trimmed];
    onChange(updated);
    setUrlInput('');
    showNotification('success', 'Image URL added to gallery.');
  };

  // Remove single image
  const handleRemoveImage = (idxToRemove: number) => {
    const updated = galleryImages.filter((_, idx) => idx !== idxToRemove);
    onChange(updated);
    // clean up failed state index mapping
    setFailedIndices((prev) => {
      const copy = { ...prev };
      delete copy[idxToRemove];
      return copy;
    });
    showNotification('success', 'Image removed from gallery.');
  };

  // Reorder images
  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  // Mark failed image load
  const handleImageError = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header with counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sand">
        <div className="flex items-center space-x-2">
          <Images className="w-4 h-4 text-warm-grey" />
          <h3 className="font-serif text-lg text-near-black">
            Project Gallery Imagery
          </h3>
          <span className="text-[11px] uppercase tracking-wider bg-sand/60 text-near-black px-2.5 py-0.5 rounded-full font-medium">
            {galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {galleryImages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Remove all gallery images for this project?')) {
                onChange([]);
                setFailedIndices({});
                showNotification('success', 'All gallery images removed.');
              }
            }}
            className="text-xs text-warm-grey hover:text-red-700 transition-colors uppercase tracking-wider font-medium inline-flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Existing Gallery Grid */}
      {galleryImages.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-warm-grey">
            Drag or use arrows to rearrange order. Click star to make any photo the main cover.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((imgUrl, idx) => {
              const isMain = mainImageUrl && mainImageUrl === imgUrl;
              const isFailed = failedIndices[idx];

              return (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-sand/30 border border-sand/80 shadow-xs flex flex-col justify-between"
                >
                  {/* Photo or Error Fallback */}
                  {isFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-sand/40">
                      <AlertTriangle className="w-6 h-6 text-warm-grey mb-1" />
                      <span className="text-[10px] text-near-black font-medium leading-tight mb-1">
                        Preview Unavailable
                      </span>
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] text-olive hover:underline truncate max-w-full px-1"
                        title={imgUrl}
                      >
                        Open original link
                      </a>
                    </div>
                  ) : (
                    <Image
                      src={imgUrl}
                      alt={`Gallery item ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(idx)}
                    />
                  )}

                  {/* Index Badge */}
                  <div className="absolute top-2 left-2 z-10 flex items-center space-x-1">
                    <span className="bg-near-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isMain && (
                      <span className="bg-olive text-white text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-sm flex items-center space-x-0.5">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Cover</span>
                      </span>
                    )}
                  </div>

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-near-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    <div className="flex items-center justify-between">
                      {/* Left / Right Reorder */}
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'left')}
                          className="p-1 rounded-sm bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Left / Earlier"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === galleryImages.length - 1}
                          onClick={() => handleMove(idx, 'right')}
                          className="p-1 rounded-sm bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Right / Later"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-sm bg-red-700/80 hover:bg-red-700 text-white transition-colors"
                        title="Remove from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      {/* Make Primary Cover */}
                      {onSetMainImage && (
                        <button
                          type="button"
                          onClick={() => {
                            onSetMainImage(imgUrl);
                            showNotification('success', `Image #${idx + 1} set as Primary Milestone Visual.`);
                          }}
                          className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm flex items-center space-x-1 transition-colors ${
                            isMain
                              ? 'bg-olive text-white'
                              : 'bg-white/20 hover:bg-white/40 text-white'
                          }`}
                          title="Set as Main Project Image"
                        >
                          <Star className={`w-3 h-3 ${isMain ? 'fill-white' : ''}`} />
                          <span>{isMain ? 'Main' : 'Set Main'}</span>
                        </button>
                      )}

                      {/* View Original */}
                      <a
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-sm bg-white/20 hover:bg-white/40 text-white transition-colors ml-auto"
                        title="View original image in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-sand/90 bg-sand/10 rounded-sm text-center">
          <Images className="w-8 h-8 text-warm-grey/60 mx-auto mb-2" strokeWidth={1.25} />
          <p className="text-xs font-medium text-near-black">No gallery images added yet</p>
          <p className="text-[11px] text-warm-grey mt-0.5">
            Upload multiple photos or paste image URLs below to showcase this architectural project.
          </p>
        </div>
      )}

      {/* ADD IMAGES SECTION - Clean, Dedicated & Intuitive */}
      <div className="bg-sand/15 border border-sand/80 rounded-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-near-black">
            Add Photos to Gallery
          </span>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-sm bg-sand/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-near-black shadow-xs'
                  : 'text-warm-grey hover:text-near-black'
              }`}
            >
              Upload Files
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-near-black shadow-xs'
                  : 'text-warm-grey hover:text-near-black'
              }`}
            >
              Add by URL
            </button>
          </div>
        </div>

        {/* Tab 1: Upload Files */}
        {activeTab === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => handleFilesUpload(e.target.files)}
            />

            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-sand/80 hover:border-olive/60 bg-white hover:bg-sand/10 rounded-sm p-6 text-center cursor-pointer transition-all duration-200 ${
                isUploading ? 'opacity-75 cursor-wait' : ''
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="w-6 h-6 border-2 border-olive border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-olive">
                    {uploadProgress
                      ? `Uploading image ${uploadProgress.current} of ${uploadProgress.total} to Cloudinary...`
                      : 'Uploading to Cloudinary...'}
                  </span>
                  <span className="text-[11px] text-warm-grey">
                    Please wait while your media is stored securely.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-sand/40 flex items-center justify-center text-warm-grey group-hover:text-olive">
                    <UploadCloud className="w-5 h-5 text-olive" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-olive hover:underline">
                      Click to choose files
                    </span>{' '}
                    <span className="text-xs text-near-black">
                      or drag & drop here
                    </span>
                  </div>
                  <p className="text-[11px] text-warm-grey">
                    Supports selecting <strong>multiple files</strong> at once (PNG, JPG, WEBP up to 10MB each)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Direct Image URL */}
        {activeTab === 'url' && (
          <form onSubmit={handleAddUrl} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-warm-grey absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://res.cloudinary.com/... or any image URL"
                className="w-full bg-white text-xs pl-9 pr-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="bg-olive hover:bg-olive-hover text-white text-xs px-4 py-2.5 rounded-sm uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
