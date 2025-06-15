"use client";

import { Product } from "@/app/services/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ImageUpload from "./ImageUploadNew";

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: Product) => Promise<void>;
    buttonText: string;
}

export default function ProductForm({
    product,
    onSubmit,
    buttonText,
}: ProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadImageFunction, setUploadImageFunction] = useState<
        (() => Promise<string | null>) | null
    >(null);
    const router = useRouter();
    // Default values for the form
    const defaultValues: Product = product || {
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "",
        stock: 0,
    };
    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<Product>({
        defaultValues,
    });
    // Handle form submission
    const handleFormSubmit = async (data: Product) => {
        try {
            setIsSubmitting(true); // Upload image to Cloudinary if there's a selected file with base64 data
            let finalImageUrl = data.image;
            if (uploadImageFunction && data.image?.startsWith("data:")) {
                console.log(
                    "Uploading image to Cloudinary before creating product..."
                );
                const cloudinaryUrl = await uploadImageFunction();
                if (cloudinaryUrl) {
                    finalImageUrl = cloudinaryUrl;
                    console.log("Image uploaded successfully:", cloudinaryUrl);
                } else {
                    // If upload fails, keep the base64 as fallback
                    console.log("Upload failed, keeping base64 preview");
                }
            }

            // Format data with uploaded image URL
            const formattedData = {
                ...data,
                price: Number(data.price),
                image: finalImageUrl,
            };

            await onSubmit(formattedData);
            toast.success("Product saved successfully!");
            router.push("/");
        } catch (error: unknown) {
            console.error("Error submitting product:", error);

            // Display a more specific error if available
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to save product";

            if (errorMessage.includes("Network error")) {
                toast.error(
                    <div>
                        <strong>Network Error</strong>
                        <p className="text-sm mt-1">
                            Cannot connect to server. Using mock data mode.
                        </p>
                    </div>,
                    { autoClose: 5000 }
                );
            } else {
                toast.error(`Error: ${errorMessage}. Please try again.`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6"
        >
            {/* Name Field */}{" "}
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Product Name *
                </label>
                <input
                    id="name"
                    type="text"
                    className={`w-full px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter product name"
                    {...register("name", {
                        required: "Product name is required",
                    })}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>
            {/* Description Field */}{" "}
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Description *
                </label>
                <textarea
                    id="description"
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                        errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                    } rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter product description"
                    {...register("description", {
                        required: "Description is required",
                    })}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>{" "}
            {/* Price Field */}
            <div className="mb-4">
                <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Price ($) *
                </label>
                <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter price"
                    {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                        valueAsNumber: true,
                    })}
                />
                {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.price.message}
                    </p>
                )}
            </div>
            {/* Category Field */}
            <div className="mb-4">
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Category *
                </label>
                <select
                    id="category"
                    className={`w-full px-3 py-2 border ${
                        errors.category ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    {...register("category", {
                        required: "Category is required",
                    })}
                >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports & Outdoors</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="toys">Toys & Games</option>
                    <option value="automotive">Automotive</option>
                    <option value="health">Health & Wellness</option>
                    <option value="food">Food & Beverages</option>
                </select>{" "}
                {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.category.message}
                    </p>
                )}
            </div>
            {/* Stock Field */}
            <div className="mb-4">
                <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Stock Quantity *
                </label>
                <input
                    id="stock"
                    type="number"
                    min="0"
                    className={`w-full px-3 py-2 border ${
                        errors.stock ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="Enter stock quantity"
                    {...register("stock", {
                        required: "Stock quantity is required",
                        min: {
                            value: 0,
                            message: "Stock must be 0 or greater",
                        },
                        valueAsNumber: true,
                    })}
                />{" "}
                {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.stock.message}
                    </p>
                )}
            </div>
            {/* Image Upload Field */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image (optional)
                </label>{" "}
                <ImageUpload
                    value={watch("image")}
                    onChange={(imageData) => {
                        setValue("image", imageData);
                    }}
                    disabled={isSubmitting}
                    uploadToCloudinary={true}
                    onGetUploadFunction={(uploadFn) => {
                        setUploadImageFunction(() => uploadFn);
                    }}
                />
                <p className="mt-1 text-xs text-gray-500">
                    Upload an image file - will be uploaded to Cloudinary when
                    you submit the form
                </p>
            </div>
            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : buttonText}
                </button>
            </div>
        </form>
    );
}
