"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { OrderService } from "@/app/services/orderService";
import { Order, PaymentRequest } from "@/types/order";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaShoppingBag, FaCreditCard, FaSync } from "react-icons/fa";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import OrderStatusTimeline from "@/app/components/OrderStatusTimeline";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

    const orderId = params.id as string;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (session?.user && orderId) {
            fetchOrder();
        }
    }, [session, status, orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const orderData = await OrderService.getOrderById(orderId);
            setOrder(orderData);
            setError(null);
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Failed to load order details");
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentClick = () => {
        setShowPaymentConfirm(true);
    };

    const handlePayment = async (paymentMethod: 'MOCK' | 'STRIPE' | 'PAYOS') => {
        if (!order) return;

        setPaymentLoading(true);
        setShowPaymentConfirm(false);

        try {
            const paymentData: PaymentRequest = {
                orderId: order.id,
                amount: order.totalAmount,
                paymentMethod
            };

            const result = await OrderService.processPayment(paymentData);

            if (result.success) {
                toast.success("Payment successful!");
                // Refresh order to show updated status
                await fetchOrder();
            } else {
                toast.error(result.message || "Payment failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment processing failed");
        } finally {
            setPaymentLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'PAID':
                return 'text-green-600 bg-green-100 border-green-200';
            case 'SHIPPED':
                return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'DELIVERED':
                return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'CANCELLED':
                return 'text-red-600 bg-red-100 border-red-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !order) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
                <div className="space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={fetchOrder}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <FaArrowLeft />
                    Back
                </button>
                <h1 className="text-3xl font-bold">
                    Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                <div className="ml-auto">
                    <button
                        onClick={fetchOrder}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Refresh order status"
                    >
                        <FaSync />
                    </button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="w-16 h-16 relative">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                <FaShoppingBag className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.product.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            ${item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="border-t mt-6 pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section for Pending Orders */}
                    {order.status === 'PENDING' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaCreditCard className="text-yellow-600 text-xl" />
                                <h3 className="text-lg font-semibold text-yellow-800">Payment Required</h3>
                            </div>
                            <p className="text-yellow-700 mb-4">
                                Your order is waiting for payment. Click the button below to complete your purchase.
                            </p>
                            <button
                                onClick={handlePaymentClick}
                                disabled={paymentLoading}
                                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {paymentLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard />
                                        Pay Now
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status Timeline */}
                    <OrderStatusTimeline 
                        status={order.status}
                        createdAt={order.createdAt}
                        updatedAt={order.updatedAt}
                    />

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Date:</span>
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items:</span>
                                <span>{order.orderItems.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 space-y-2">
                            <Link
                                href="/orders"
                                className="block w-full text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View All Orders
                            </Link>
                            <Link
                                href="/"
                                className="block w-full text-center py-2 text-blue-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showPaymentConfirm}
                title="Confirm Payment"
                message={`Are you sure you want to proceed with the payment of $${order.totalAmount.toFixed(2)}? This will process the payment using mock payment method.`}
                confirmText="Pay Now"
                cancelText="Cancel"
                onConfirm={() => handlePayment('MOCK')}
                onCancel={() => setShowPaymentConfirm(false)}
                type="info"
            />
        </div>    );
}
