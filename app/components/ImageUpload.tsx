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
        {!imageToShow && !hasSelectedFile ? (
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
        ) : (
          <div className="relative">
            <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
              {imageToShow ? (
                imageToShow.startsWith('data:') ? (
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                )
              ) : hasSelectedFile ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FiImage className="h-16 w-16 mb-3" />
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Image will be uploaded when you submit the form
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <FiImage className="h-12 w-12" />
                </div>
              )}
            </div>
            {fileName && (
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <FiImage className="h-4 w-4 mr-1" />
                  <span className="truncate">{fileName}</span>
                </div>
                {hasSelectedFile && imageToShow?.startsWith('data:') && (
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              disabled={disabled}
              title="Remove image"
            >
              <FiX className="h-4 w-4" />
            </button>
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:bg-gray-50"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                {uploadToCloudinary ? 'Uploading to Cloudinary...' : 'Processing image...'}
              </span>
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