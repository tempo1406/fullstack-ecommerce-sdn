"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface UseFileUploadProps {
    maxSizeInMB?: number;
    allowedTypes?: string[];
    onUpload?: (file: File, imageUrl: string) => void;
    uploadToCloudinary?: boolean;
}

// Add return type interface
interface UseFileUploadReturn {
    uploading: boolean;
    preview: string | null;
    fileName: string | null;
    uploadProgress: number;
    selectedFile: File | null;
    handleFileSelect: (file: File) => Promise<void>;
    uploadSelectedFile: () => Promise<string | null>;
    clearFile: () => void;
    validateFile: (file: File) => boolean;
}

export function useFileUpload({
    maxSizeInMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    onUpload,
    uploadToCloudinary = true,
}: UseFileUploadProps = {}): UseFileUploadReturn {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const validateFile = useCallback(
        (file: File): boolean => {
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                toast.error(
                    `File type not supported. Allowed types: ${allowedTypes.join(
                        ", "
                    )}`
                );
                return false;
            }

            // Check file size
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                toast.error(`File size must be less than ${maxSizeInMB}MB`);
                return false;
            }

            return true;
        },
        [allowedTypes, maxSizeInMB]
    );
    const uploadToBackend = useCallback(async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);

        const API_URL =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

        const response = await fetch(`${API_URL}/upload/image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.url; // Cloudinary URL from backend
    }, []);
    const handleFileSelect = useCallback(
        async (file: File) => {
            if (!validateFile(file)) return;

            // Store the selected file for later upload
            setSelectedFile(file);
            setFileName(file.name);

            // Create preview URL for immediate display
            const reader = new FileReader();

            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;

                if (dataUrl && dataUrl.startsWith("data:image/")) {
                    setPreview(dataUrl);

                    if (onUpload) {
                        onUpload(file, dataUrl);
                    }
                } else {
                    console.error(
                        "Invalid data URL format:",
                        dataUrl?.substring(0, 100)
                    );
                }
            };

            reader.onerror = (e) => {
                console.error("FileReader error:", e);
                console.error("FileReader error target:", e.target);
            };

            reader.onloadstart = () => {
                console.log("FileReader started reading file");
            };

            reader.onprogress = (e) => {
                console.log("FileReader progress:", e.loaded, "/", e.total);
            };

            console.log("About to call FileReader.readAsDataURL()");
            reader.readAsDataURL(file);
            console.log("FileReader.readAsDataURL() called");
        },
        [validateFile, onUpload]
    );
    // New function to upload the selected file to Cloudinary
    const uploadSelectedFile = useCallback(async (): Promise<string | null> => {
        if (!selectedFile) return null;

        setUploading(true);
        setUploadProgress(0);

        try {
            if (uploadToCloudinary) {
                console.log(
                    "Uploading file to Cloudinary via backend:",
                    selectedFile.name
                );
                const cloudinaryUrl = await uploadToBackend(selectedFile);
                console.log(
                    "Successfully uploaded to Cloudinary:",
                    cloudinaryUrl
                );
                toast.success("Image uploaded successfully!");

                // Update preview with Cloudinary URL
                setPreview(cloudinaryUrl);

                return cloudinaryUrl;
            } else {
                // For non-Cloudinary uploads, still avoid base64
                return null;
            }
        } catch (uploadError) {
            console.error("Failed to upload to Cloudinary:", uploadError);
            toast.error("Failed to upload image. Please try again.");

            return null;
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [selectedFile, uploadToCloudinary, uploadToBackend]);
    const clearFile = useCallback(() => {
        setPreview(null);
        setFileName(null);
        setSelectedFile(null);
        setUploadProgress(0);
    }, []);

    return {
        uploading,
        preview,
        fileName,
        uploadProgress,
        selectedFile,
        handleFileSelect,
        uploadSelectedFile,
        clearFile,
        validateFile,
    };
}
