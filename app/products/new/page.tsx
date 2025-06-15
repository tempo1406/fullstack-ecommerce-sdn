"use client";

import { Product, ProductService } from "@/app/services/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductForm from "@/app/components/ProductForm";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Link from "next/link";

export default function CreateProduct() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Still loading
        if (!session) {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (!session) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Authentication Required
                </h1>
                <p className="text-gray-600 mb-6">
                    You need to be signed in to create products.
                </p>
                <Link
                    href="/auth/signin"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    const handleSubmit = async (data: Product) => {
        try {
            await ProductService.create(data);
        } catch (error) {
            throw error;
        }
    };
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Product
            </h1>

            <ProductForm onSubmit={handleSubmit} buttonText="Create Product" />
        </div>
    );
}
