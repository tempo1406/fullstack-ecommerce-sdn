"use client";

import { useCart } from "@/app/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { OrderService } from "@/app/services/orderService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export default function CartPage() {
    const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCart();
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const router = useRouter();    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveClick(id);
        } else {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveClick = (id: string) => {
        setItemToRemove(id);
        setShowConfirm(true);
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            removeItem(itemToRemove);
            toast.success("Item removed from cart");
        }
        setShowConfirm(false);
        setItemToRemove(null);
    };

    const handleClearCartClick = () => {
        setShowClearConfirm(true);
    };

    const confirmClearCart = () => {
        clearCart();
        toast.success("Cart cleared");
        setShowClearConfirm(false);
    };

    const handleCheckout = async () => {
        if (!session) {
            toast.error("Please sign in to place an order");
            router.push("/auth/signin");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsProcessing(true);

        try {
            // Create order
            const orderData = {
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount
            };

            const order = await OrderService.createOrder(orderData);
            
            // Clear cart after successful order
            clearCart();
            
            toast.success("Order placed successfully!");
            router.push(`/orders/${order.id}`);
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to get started</p>
                <Link 
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>
            
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center gap-4">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 relative">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                <FaShoppingCart className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                                        <p className="text-sm text-gray-500">In stock: {item.stock}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                            disabled={isProcessing}
                                        >
                                            <FaMinus className="text-sm" />
                                        </button>
                                        <span className="w-12 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                            disabled={item.quantity >= item.stock || isProcessing}
                                        >
                                            <FaPlus className="text-sm" />
                                        </button>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveClick(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                        disabled={isProcessing}
                                        title="Remove item from cart"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <LoadingSpinner />
                                    Processing...
                                </>
                            ) : (
                                "Proceed to Checkout"
                            )}
                        </button>                        <div className="mt-4">
                            <button
                                onClick={handleClearCartClick}
                                disabled={isProcessing}
                                className="w-full text-red-600 py-2 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                Clear Cart
                            </button>
                        </div>                        <div className="mt-4 text-center">
                            <Link 
                                href="/"
                                className="text-blue-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmDialog
                isOpen={showConfirm}
                title="Remove Item"
                message="Are you sure you want to remove this item from your cart?"
                confirmText="Remove"
                cancelText="Keep"
                onConfirm={confirmRemove}
                onCancel={() => setShowConfirm(false)}
                type="danger"
            />

            <ConfirmDialog
                isOpen={showClearConfirm}
                title="Clear Cart"
                message="Are you sure you want to clear all items from your cart? This action cannot be undone."
                confirmText="Clear Cart"
                cancelText="Keep Items"
                onConfirm={confirmClearCart}
                onCancel={() => setShowClearConfirm(false)}
                type="danger"
            />
        </div>
    );
}
