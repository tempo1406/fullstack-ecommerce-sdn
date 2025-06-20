"use client";

import { Product } from "@/app/services/api";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt, FaEdit, FaUser, FaShoppingCart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/contexts/CartContext";
import { toast } from "react-toastify";
import Badge from "./Badge";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { data: session } = useSession();
    const { addItem } = useCart();
    const isOwner = session?.user?.id === product.userId;
    
    // Get image URL - check if it's from Cloudinary to apply optimizations
    const imageUrl =
        product.image || "https://via.placeholder.com/300x300?text=No+Image";

    // Format price to currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error("Product is out of stock");
            return;
        }

        if (!product.id) {
            toast.error("Invalid product");
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            quantity: 1,
            stock: product.stock || 0
        };

        addItem(cartItem);
        toast.success("Product added to cart!");
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-200 transform hover:-translate-y-1">
            {/* Product Image with hover effect */}
            <Link href={`/products/${product.id}`} className="relative">
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-gray-800 text-sm font-medium">
                            Quick View
                        </div>
                    </div>
                    {/* Product badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {product.category && (
                            <Badge text={product.category} color="primary" />
                        )}
                        {product.stock !== undefined && product.stock === 0 && (
                            <Badge text="Out of Stock" color="danger" />
                        )}
                        {product.stock !== undefined &&
                            product.stock > 0 &&
                            product.stock <= 5 && (
                                <Badge text="Low Stock" color="warning" />
                            )}
                        {product.stock !== undefined &&
                            product.stock > 0 &&
                            product.stock >= 50 && (
                                <Badge text="High Stock" color="success" />
                            )}
                    </div>
                </div>
            </Link>
            {/* Product Info */}
            <div className="p-4 flex-grow flex flex-col">
                {" "}
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {product.name}
                    </h3>
                </Link>{" "}
                {/* Brief description preview */}
                {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}
                {/* Stock and Category Info */}{" "}
                <div className="flex items-center justify-between mb-3 text-sm">
                    {product.category && (
                        <span className="text-gray-500 capitalize">
                            {product.category}
                        </span>
                    )}
                    {product.stock !== undefined && (
                        <span
                            className={`font-medium ${
                                product.stock === 0
                                    ? "text-red-600"
                                    : product.stock <= 5
                                    ? "text-orange-600"
                                    : "text-green-600"
                            }`}
                        >
                            {product.stock === 0
                                ? "Out of Stock"
                                : `${product.stock} in stock`}
                        </span>
                    )}
                </div>                <p className="text-xl font-bold text-primary-600 mt-auto">
                    {formatPrice(product.price)}
                </p>
                
                {/* User info */}
                {product.user && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <FaUser size={12} />
                        <span>By {product.user.name || product.user.email}</span>
                    </div>
                )}
            </div>
              {/* Action buttons */}
            <div className="p-4 pt-0 flex gap-2">
                <Link
                    href={`/products/${product.id}`}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 text-center font-medium hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 rounded"
                >
                    <span>View Details</span>
                    <FaExternalLinkAlt size={12} />
                </Link>
                
                {/* Add to Cart Button */}
                {!isOwner && (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition-colors rounded flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    >
                        <FaShoppingCart size={14} />
                    </button>
                )}
                
                {/* Edit/Delete buttons for product owner */}
                {isOwner && (
                    <>
                        <Link
                            href={`/products/${product.id}/edit`}
                            className="bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition-colors rounded flex items-center justify-center"
                            title="Edit Product"
                        >
                            <FaEdit size={14} />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
