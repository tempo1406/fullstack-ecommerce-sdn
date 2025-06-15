'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFileUpload } from '@/app/hooks/useFileUpload';
import Image from 'next/image';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  value?: string;
  onChange: (imageData: string) => void;
  disabled?: boolean;
  className?: string;
  uploadToCloudinary?: boolean;
  onGetUploadFunction?: (uploadFn: () => Promise<string | null>) => void;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  disabled = false,
  className = '',
  uploadToCloudinary = true,
  onGetUploadFunction
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { 
    uploading, 
    preview, 
    fileName, 
    uploadProgress, 
    selectedFile, 
    handleFileSelect, 
    uploadSelectedFile, 
    clearFile 
  } = useFileUpload({
    maxSizeInMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadToCloudinary,
    onUpload: (file: File, imageUrl: string) => {
      onChange(imageUrl);
    }
  });

  const provideUploadFunction = useCallback(() => {
    if (onGetUploadFunction) {
      onGetUploadFunction(uploadSelectedFile);
    }
  }, [onGetUploadFunction, uploadSelectedFile]);

  useEffect(() => {
    provideUploadFunction();
  }, [provideUploadFunction]);

  const imageToShow = preview || value;
  const hasSelectedFile = !!selectedFile;
  const isCloudinaryUrl = imageToShow?.includes('cloudinary.com');

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    clearFile();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const shouldShowImage = imageToShow && imageToShow.length > 0;
  const shouldShowPlaceholder = hasSelectedFile && !shouldShowImage;
  const shouldShowEmpty = !shouldShowImage && !shouldShowPlaceholder;

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${uploading ? 'animate-pulse' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Empty state */}
        {shouldShowEmpty && (
          <div className="text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              {' or drag and drop'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WebP up to 5MB
            </p>
            {uploadToCloudinary && (
              <p className="text-xs text-blue-500 mt-1">
                Images will be uploaded to Cloudinary when you submit the form
              </p>
            )}
          </div>
        )}

        {/* Image preview */}
        {shouldShowImage && (
          <div className="relative">
            <div className="relative w-full h-64 bg-gradient-to-r from-blue-100 to-green-100 rounded-md overflow-hidden border-2 border-dashed border-blue-300">
              {imageToShow.startsWith('data:') ? (
                <img
                  src={imageToShow}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={imageToShow}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              )}
            </div>
            
            {/* Clear Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              disabled={disabled}
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Placeholder when file selected but no preview */}
        {shouldShowPlaceholder && (
          <div className="text-center py-8">
            <FiImage className="mx-auto h-16 w-16 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">{fileName}</p>
            <p className="text-xs text-gray-400 mt-1">
              Preview not available
            </p>
          </div>
        )}

        {/* File info */}
        {fileName && shouldShowImage && (
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <FiImage className="h-4 w-4 mr-1" />
              <span className="truncate">{fileName}</span>
            </div>
            {imageToShow?.startsWith('data:') && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Ready to upload
              </span>
            )}
            {isCloudinaryUrl && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Cloudinary
              </span>
            )}
          </div>
        )}

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Uploading...</span>
              {uploadProgress > 0 && (
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
